import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import type { Destination } from '../../types';
import { destinations } from '../../data/mockData';
import { groupDestinationsByRegion } from '../../utils/helpers';

interface DestinationSelectProps {
  value: Destination | null;
  onChange: (destination: Destination) => void;
}

export function DestinationSelect({ value, onChange }: DestinationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const groupedDestinations = groupDestinationsByRegion(destinations);

  const filteredGroups = Object.entries(groupedDestinations).reduce((acc, [region, dests]) => {
    const filtered = dests.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[region] = filtered;
    }
    return acc;
  }, {} as Record<string, Destination[]>);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (destination: Destination) => {
    onChange(destination);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-navy mb-2">Destination</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl transition-premium ${
          isOpen ? 'border-gold ring-2 ring-gold/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <img
              src={value.imageUrl}
              alt={value.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="text-left">
              <p className="font-medium text-navy">{value.name}</p>
              <p className="text-xs text-slate-500">{value.region}</p>
            </div>
          </div>
        ) : (
          <span className="text-slate-400">Select a destination...</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          {/* Destination list */}
          <div className="max-h-72 overflow-y-auto">
            {Object.entries(filteredGroups).map(([region, dests]) => (
              <div key={region}>
                <div className="px-4 py-2 bg-slate-50 sticky top-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {region}
                  </p>
                </div>
                {dests.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                      value?.id === dest.id ? 'bg-gold/5' : ''
                    }`}
                  >
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-left flex-1">
                      <p className="font-medium text-navy">{dest.name}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{dest.region}</span>
                      </div>
                    </div>
                    {value?.id === dest.id && (
                      <div className="w-2 h-2 bg-gold rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            ))}

            {Object.keys(filteredGroups).length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No destinations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
