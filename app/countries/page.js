"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Filter, X, Loader2 } from "lucide-react";
import SearchForm from "../components/SearchForm";
import React from "react";
import axios from "axios";

const LazyCountryCard = React.lazy(() => import("../components/Cards"));

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_BATCH = 12;
const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

const CountriesPage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    region: "",
    languages: "",
    timezone: "",
    sortBy: "name",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreCountries();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const loadMoreCountries = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page,
        limit: ITEMS_PER_BATCH,
        ...filters,
        regions: selectedRegions.join(","),
      });

      const response = await axios.get(`${API_BASE_URL}/countries?${params}`);

      const newData = response.data.data;

      setCountries((prev) => [...prev, ...newData]);
      setHasMore(newData.length === ITEMS_PER_BATCH);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const handleRegionToggle = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
    resetPagination();
  };

  const resetPagination = () => {
    setCountries([]);
    setPage(1);
    setHasMore(true);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      region: "",
      languages: "",
      timezone: "",
      sortBy: "name",
    });
    setSelectedRegions([]);
    resetPagination();
  };

  useEffect(() => {
    setAppliedFilters(
      Object.values(filters).filter((v) => v).length + selectedRegions.length
    );
  }, [filters, selectedRegions]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchForm
              value={filters.search}
              onChange={(value) => handleFilterChange("search", value)}
              className="w-full md:w-96"
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
              {appliedFilters > 0 && (
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {appliedFilters}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border animate-in slide-in-from-top">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        onClick={() => handleRegionToggle(region)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedRegions.includes(region)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X size={20} />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {error && (
          <div className="text-red-500 p-4 text-center bg-red-50 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          <Suspense fallback={<Loader2 />}>
            {countries.map((country, index) => (
              <LazyCountryCard
                key={`${country.name}-${index}`}
                country={country}
              />
            ))}
          </Suspense>
        </div>

        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center"
        >
          {loading && <Loader2 className="w-6 h-6 animate-spin" />}
          {!hasMore && countries.length > 0 && (
            <p className="text-gray-500">No more countries to load</p>
          )}
          {!hasMore && countries.length === 0 && (
            <p className="text-gray-500">No countries found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CountriesPage;
