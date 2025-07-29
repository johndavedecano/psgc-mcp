import { describe, it, expect, beforeAll } from 'vitest';
import { PSGCClient } from '../../src/services/psgc-client';

describe('PSGC API Integration', () => {
  let client: PSGCClient;

  beforeAll(() => {
    client = new PSGCClient({
      timeout: 10000,
      retries: 2,
      cacheTTL: 60000, // 1 minute for testing
    });
  });

  describe('Island Groups', () => {
    it('should fetch all island groups', async () => {
      const islandGroups = await client.getIslandGroups();

      expect(islandGroups).toBeInstanceOf(Array);
      expect(islandGroups.length).toBeGreaterThan(0);
      expect(islandGroups[0]).toHaveProperty('code');
      expect(islandGroups[0]).toHaveProperty('name');

      // Should contain Luzon, Visayas, Mindanao
      const codes = islandGroups.map((ig) => ig.code);
      expect(codes).toContain('luzon');
      expect(codes).toContain('visayas');
      expect(codes).toContain('mindanao');
    });

    it('should fetch specific island group', async () => {
      const islandGroup = await client.getIslandGroup('luzon');

      expect(islandGroup).toHaveProperty('code', 'luzon');
      expect(islandGroup).toHaveProperty('name', 'Luzon');
    });
  });

  describe('Regions', () => {
    it('should fetch all regions', async () => {
      const regions = await client.getRegions();

      expect(regions).toBeInstanceOf(Array);
      expect(regions.length).toBeGreaterThan(0);
      expect(regions[0]).toHaveProperty('code');
      expect(regions[0]).toHaveProperty('name');
      expect(regions[0]).toHaveProperty('regionName');
      expect(regions[0]).toHaveProperty('islandGroupCode');
    });

    it('should fetch specific region', async () => {
      const region = await client.getRegion('130000000');

      expect(region).toHaveProperty('code', '130000000');
      expect(region).toHaveProperty('name', 'NCR');
      expect(region).toHaveProperty('regionName', 'National Capital Region');
    });

    it('should fetch provinces in a region', async () => {
      // Use Region I (Ilocos Region) instead of NCR since NCR has no provinces
      const provinces = await client.getRegionProvinces('010000000');

      expect(provinces).toBeInstanceOf(Array);
      expect(provinces.length).toBeGreaterThan(0);
      expect(provinces[0]).toHaveProperty('code');
      expect(provinces[0]).toHaveProperty('name');
      expect(provinces[0]).toHaveProperty('regionCode', '010000000');
    });
  });

  describe('Provinces', () => {
    it('should fetch all provinces', async () => {
      const provinces = await client.getProvinces();

      expect(provinces).toBeInstanceOf(Array);
      expect(provinces.length).toBeGreaterThan(0);
      expect(provinces[0]).toHaveProperty('code');
      expect(provinces[0]).toHaveProperty('name');
      expect(provinces[0]).toHaveProperty('regionCode');
    });

    it('should fetch specific province', async () => {
      const province = await client.getProvince('012800000');

      expect(province).toHaveProperty('code', '012800000');
      expect(province).toHaveProperty('name', 'Ilocos Norte');
    });

    it('should fetch cities in a province', async () => {
      const cities = await client.getProvinceCities('012800000');

      expect(cities).toBeInstanceOf(Array);
      expect(cities[0]).toHaveProperty('code');
      expect(cities[0]).toHaveProperty('name');
      expect(cities[0]).toHaveProperty('provinceCode', '012800000');
    });
  });

  describe('Cities', () => {
    it('should fetch all cities', async () => {
      const cities = await client.getCities();

      expect(cities).toBeInstanceOf(Array);
      expect(cities.length).toBeGreaterThan(0);
      expect(cities[0]).toHaveProperty('code');
      expect(cities[0]).toHaveProperty('name');
    });

    it('should fetch specific city', async () => {
      const city = await client.getCity('012805000');

      expect(city).toHaveProperty('code', '012805000');
      expect(city).toHaveProperty('name');
    });

    it('should fetch barangays in a city', async () => {
      const barangays = await client.getCityBarangays('012805000');

      expect(barangays).toBeInstanceOf(Array);
      expect(barangays[0]).toHaveProperty('code');
      expect(barangays[0]).toHaveProperty('name');
      expect(barangays[0]).toHaveProperty('cityCode', '012805000');
    });
  });

  describe('Barangays', () => {
    it('should fetch all barangays', async () => {
      const barangays = await client.getBarangays();

      expect(barangays).toBeInstanceOf(Array);
      expect(barangays.length).toBeGreaterThan(0);
      expect(barangays[0]).toHaveProperty('code');
      expect(barangays[0]).toHaveProperty('name');
    });

    it('should fetch specific barangay', async () => {
      const barangay = await client.getBarangay('012805001');

      expect(barangay).toHaveProperty('code', '012805001');
      expect(barangay).toHaveProperty('name');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      try {
        await client.getRegion('invalid-code');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('not found');
      }
    });
  });

  describe('Caching', () => {
    it('should cache responses', async () => {
      // First call
      const regions1 = await client.getRegions();

      // Second call should be faster due to caching
      const start = Date.now();
      const regions2 = await client.getRegions();
      const duration = Date.now() - start;

      expect(regions1).toEqual(regions2);
      expect(duration).toBeLessThan(100); // Should be very fast from cache
    });
  });
});
