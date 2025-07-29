import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { z } from 'zod';
import {
  IslandGroup,
  Region,
  Province,
  District,
  City,
  Municipality,
  CityMunicipality,
  SubMunicipality,
  Barangay,
} from '../types';
// Remove unused import

/**
 * Configuration for PSGC API client
 */
export interface PSGCClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cacheTTL?: number;
}

/**
 * Custom error class for PSGC API errors
 */
export class PSGCApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PSGCApiError';
  }
}

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * PSGC API Client - A robust HTTP client for the Philippine Standard Geographic Code API
 */
export class PSGCClient {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private config: Required<PSGCClientConfig>;

  constructor(config: PSGCClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || 'https://psgc.gitlab.io/api',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      cacheTTL: config.cacheTTL || 5 * 60 * 1000, // 5 minutes default
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'psgc-mcp-server/1.0.0',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Handle API errors with retry logic
   */
  private async handleError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const endpoint = error.config?.url;

      if (statusCode === 404) {
        throw new PSGCApiError('Resource not found', statusCode, endpoint);
      }

      if (statusCode && statusCode >= 500) {
        throw new PSGCApiError('Server error', statusCode, endpoint);
      }

      throw new PSGCApiError(
        error.message || 'Network error',
        statusCode,
        endpoint,
        error.response?.data
      );
    }

    throw new PSGCApiError('Unknown error occurred');
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(endpoint: string): string {
    return `psgc:${endpoint}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.cacheTTL;
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry && this.isCacheValid(entry.timestamp)) {
      return entry.data;
    }
    return null;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(entry.timestamp)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Make HTTP request with caching and retry logic
   */
  private async request<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint);

    // Check cache first
    if (useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response: AxiosResponse<T> = await this.client.get(endpoint);
        const data = response.data;

        // Cache successful response
        if (useCache) {
          this.setCache(cacheKey, data);
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on 404
        if (error instanceof PSGCApiError && error.statusCode === 404) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Get all island groups
   */
  async getIslandGroups(): Promise<IslandGroup[]> {
    return this.request<IslandGroup[]>('/island-groups.json');
  }

  /**
   * Get specific island group by code
   */
  async getIslandGroup(code: string): Promise<IslandGroup> {
    return this.request<IslandGroup>(`/island-groups/${code}.json`);
  }

  /**
   * Get regions in an island group
   */
  async getIslandGroupRegions(islandGroupCode: string): Promise<Region[]> {
    return this.request<Region[]>(`/island-groups/${islandGroupCode}/regions.json`);
  }

  /**
   * Get provinces in an island group
   */
  async getIslandGroupProvinces(islandGroupCode: string): Promise<Province[]> {
    return this.request<Province[]>(`/island-groups/${islandGroupCode}/provinces.json`);
  }

  /**
   * Get districts in an island group
   */
  async getIslandGroupDistricts(islandGroupCode: string): Promise<District[]> {
    return this.request<District[]>(`/island-groups/${islandGroupCode}/districts.json`);
  }

  /**
   * Get cities in an island group
   */
  async getIslandGroupCities(islandGroupCode: string): Promise<City[]> {
    return this.request<City[]>(`/island-groups/${islandGroupCode}/cities.json`);
  }

  /**
   * Get municipalities in an island group
   */
  async getIslandGroupMunicipalities(islandGroupCode: string): Promise<Municipality[]> {
    return this.request<Municipality[]>(`/island-groups/${islandGroupCode}/municipalities.json`);
  }

  /**
   * Get cities and municipalities in an island group
   */
  async getIslandGroupCitiesMunicipalities(islandGroupCode: string): Promise<CityMunicipality[]> {
    return this.request<CityMunicipality[]>(
      `/island-groups/${islandGroupCode}/cities-municipalities.json`
    );
  }

  /**
   * Get sub-municipalities in an island group
   */
  async getIslandGroupSubMunicipalities(islandGroupCode: string): Promise<SubMunicipality[]> {
    return this.request<SubMunicipality[]>(
      `/island-groups/${islandGroupCode}/sub-municipalities.json`
    );
  }

  /**
   * Get barangays in an island group
   */
  async getIslandGroupBarangays(islandGroupCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/island-groups/${islandGroupCode}/barangays.json`);
  }

  /**
   * Get all regions
   */
  async getRegions(): Promise<Region[]> {
    return this.request<Region[]>('/regions.json');
  }

  /**
   * Get specific region by code
   */
  async getRegion(code: string): Promise<Region> {
    return this.request<Region>(`/regions/${code}.json`);
  }

  /**
   * Get provinces in a region
   */
  async getRegionProvinces(regionCode: string): Promise<Province[]> {
    return this.request<Province[]>(`/regions/${regionCode}/provinces.json`);
  }

  /**
   * Get districts in a region
   */
  async getRegionDistricts(regionCode: string): Promise<District[]> {
    return this.request<District[]>(`/regions/${regionCode}/districts.json`);
  }

  /**
   * Get cities in a region
   */
  async getRegionCities(regionCode: string): Promise<City[]> {
    return this.request<City[]>(`/regions/${regionCode}/cities.json`);
  }

  /**
   * Get municipalities in a region
   */
  async getRegionMunicipalities(regionCode: string): Promise<Municipality[]> {
    return this.request<Municipality[]>(`/regions/${regionCode}/municipalities.json`);
  }

  /**
   * Get cities and municipalities in a region
   */
  async getRegionCitiesMunicipalities(regionCode: string): Promise<CityMunicipality[]> {
    return this.request<CityMunicipality[]>(`/regions/${regionCode}/cities-municipalities.json`);
  }

  /**
   * Get sub-municipalities in a region
   */
  async getRegionSubMunicipalities(regionCode: string): Promise<SubMunicipality[]> {
    return this.request<SubMunicipality[]>(`/regions/${regionCode}/sub-municipalities.json`);
  }

  /**
   * Get barangays in a region
   */
  async getRegionBarangays(regionCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/regions/${regionCode}/barangays.json`);
  }

  /**
   * Get all provinces
   */
  async getProvinces(): Promise<Province[]> {
    return this.request<Province[]>('/provinces.json');
  }

  /**
   * Get specific province by code
   */
  async getProvince(code: string): Promise<Province> {
    return this.request<Province>(`/provinces/${code}.json`);
  }

  /**
   * Get cities in a province
   */
  async getProvinceCities(provinceCode: string): Promise<City[]> {
    return this.request<City[]>(`/provinces/${provinceCode}/cities.json`);
  }

  /**
   * Get municipalities in a province
   */
  async getProvinceMunicipalities(provinceCode: string): Promise<Municipality[]> {
    return this.request<Municipality[]>(`/provinces/${provinceCode}/municipalities.json`);
  }

  /**
   * Get cities and municipalities in a province
   */
  async getProvinceCitiesMunicipalities(provinceCode: string): Promise<CityMunicipality[]> {
    return this.request<CityMunicipality[]>(
      `/provinces/${provinceCode}/cities-municipalities.json`
    );
  }

  /**
   * Get sub-municipalities in a province
   */
  async getProvinceSubMunicipalities(provinceCode: string): Promise<SubMunicipality[]> {
    return this.request<SubMunicipality[]>(`/provinces/${provinceCode}/sub-municipalities.json`);
  }

  /**
   * Get barangays in a province
   */
  async getProvinceBarangays(provinceCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/provinces/${provinceCode}/barangays.json`);
  }

  /**
   * Get all districts
   */
  async getDistricts(): Promise<District[]> {
    return this.request<District[]>('/districts.json');
  }

  /**
   * Get specific district by code
   */
  async getDistrict(code: string): Promise<District> {
    return this.request<District>(`/districts/${code}.json`);
  }

  /**
   * Get cities in a district
   */
  async getDistrictCities(districtCode: string): Promise<City[]> {
    return this.request<City[]>(`/districts/${districtCode}/cities.json`);
  }

  /**
   * Get municipalities in a district
   */
  async getDistrictMunicipalities(districtCode: string): Promise<Municipality[]> {
    return this.request<Municipality[]>(`/districts/${districtCode}/municipalities.json`);
  }

  /**
   * Get cities and municipalities in a district
   */
  async getDistrictCitiesMunicipalities(districtCode: string): Promise<CityMunicipality[]> {
    return this.request<CityMunicipality[]>(
      `/districts/${districtCode}/cities-municipalities.json`
    );
  }

  /**
   * Get sub-municipalities in a district
   */
  async getDistrictSubMunicipalities(districtCode: string): Promise<SubMunicipality[]> {
    return this.request<SubMunicipality[]>(`/districts/${districtCode}/sub-municipalities.json`);
  }

  /**
   * Get barangays in a district
   */
  async getDistrictBarangays(districtCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/districts/${districtCode}/barangays.json`);
  }

  /**
   * Get all cities
   */
  async getCities(): Promise<City[]> {
    return this.request<City[]>('/cities.json');
  }

  /**
   * Get specific city by code
   */
  async getCity(code: string): Promise<City> {
    return this.request<City>(`/cities/${code}.json`);
  }

  /**
   * Get barangays in a city
   */
  async getCityBarangays(cityCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/cities/${cityCode}/barangays.json`);
  }

  /**
   * Get all municipalities
   */
  async getMunicipalities(): Promise<Municipality[]> {
    return this.request<Municipality[]>('/municipalities.json');
  }

  /**
   * Get specific municipality by code
   */
  async getMunicipality(code: string): Promise<Municipality> {
    return this.request<Municipality>(`/municipalities/${code}.json`);
  }

  /**
   * Get barangays in a municipality
   */
  async getMunicipalityBarangays(municipalityCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/municipalities/${municipalityCode}/barangays.json`);
  }

  /**
   * Get all sub-municipalities
   */
  async getSubMunicipalities(): Promise<SubMunicipality[]> {
    return this.request<SubMunicipality[]>('/sub-municipalities.json');
  }

  /**
   * Get specific sub-municipality by code
   */
  async getSubMunicipality(code: string): Promise<SubMunicipality> {
    return this.request<SubMunicipality>(`/sub-municipalities/${code}.json`);
  }

  /**
   * Get barangays in a sub-municipality
   */
  async getSubMunicipalityBarangays(subMunicipalityCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(`/sub-municipalities/${subMunicipalityCode}/barangays.json`);
  }

  /**
   * Get all cities and municipalities
   */
  async getCitiesMunicipalities(): Promise<CityMunicipality[]> {
    return this.request<CityMunicipality[]>('/cities-municipalities.json');
  }

  /**
   * Get specific city or municipality by code
   */
  async getCityMunicipality(code: string): Promise<CityMunicipality> {
    return this.request<CityMunicipality>(`/cities-municipalities/${code}.json`);
  }

  /**
   * Get barangays in a city or municipality
   */
  async getCityMunicipalityBarangays(cityOrMunicipalityCode: string): Promise<Barangay[]> {
    return this.request<Barangay[]>(
      `/cities-municipalities/${cityOrMunicipalityCode}/barangays.json`
    );
  }

  /**
   * Get all barangays
   */
  async getBarangays(): Promise<Barangay[]> {
    return this.request<Barangay[]>('/barangays.json');
  }

  /**
   * Get specific barangay by code
   */
  async getBarangay(code: string): Promise<Barangay> {
    return this.request<Barangay>(`/barangays/${code}.json`);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  cleanupCache(): void {
    this.clearExpiredCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const psgcClient = new PSGCClient();
