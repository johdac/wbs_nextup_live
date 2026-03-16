import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

interface OpenStreetResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationSearchResult {
  displayName: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: LocationSearchResult) => void;
  onClear?: () => void;
  label?: string;
  className?: string;
}

const SEARCH_DEBOUNCE_MS = 400;

export default function LocationSearch({
  value,
  onChange,
  onSelect,
  onClear,
  label = "Location",
  className = "",
}: LocationSearchProps) {
  const [results, setResults] = useState<OpenStreetResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);

  useEffect(() => {
    if (hasSelectedLocation || value.trim().length < 3) {
      setIsSearching(false);
      setResults([]);
      setShowResults(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to search location");
        }

        const data = (await response.json()) as OpenStreetResult[];
        setResults(data);
        setShowResults(true);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
      setIsSearching(false);
    };
  }, [hasSelectedLocation, value]);

  const handleChange = (newValue: string) => {
    setHasSelectedLocation(false);
    onChange(newValue);
  };

  const handleSelect = (result: OpenStreetResult) => {
    setHasSelectedLocation(true);
    setResults([]);
    setShowResults(false);
    onChange(result.display_name);
    onSelect({
      displayName: result.display_name,
      lat: Number(result.lat),
      lng: Number(result.lon),
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label={label}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          onBlur={() => {
            window.setTimeout(() => setShowResults(false), 150);
          }}
          fullWidth
          size="small"
          variant="outlined"
          className="mui-white-outline"
        />
        {value && value.length > 0 && (
          <button
            type="button"
            aria-label="Clear location"
            onClick={() => {
              setHasSelectedLocation(false);
              onChange("");
              onClear?.();
            }}
            style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 18 }}
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>

      {isSearching && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md bg-black/90 px-3 py-2 text-sm text-white">
          Searching locations...
        </div>
      )}

      {!isSearching && showResults && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-purple-500/30 bg-black/95">
          {results.map((result) => (
            <button
              key={`${result.place_id}-${result.lat}-${result.lon}`}
              type="button"
              onMouseDown={() => handleSelect(result)}
              className="block w-full border-b border-purple-500/20 px-3 py-2 text-left text-sm text-white hover:bg-purple-500/20"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}