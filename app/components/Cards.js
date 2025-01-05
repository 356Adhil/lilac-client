import { Globe, MapPin, Users, Clock } from "lucide-react";

const CountryCard = ({ country }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      <div className="relative pb-[56.25%] mb-4 overflow-hidden rounded-lg">
        <img
          src={country.flag}
          alt={`Flag of ${country.name.common}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {country.name.common}
      </h2>

      <div className="flex-1 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Capital</p>
            <p className="text-sm font-medium">
              {country.capital?.[0] || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Globe size={16} className="text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Region</p>
            <p className="text-sm font-medium">{country.region || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users size={16} className="text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Population</p>
            <p className="text-sm font-medium">
              {country.population?.toLocaleString() || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock size={16} className="text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Timezones</p>
            <p className="text-sm font-medium line-clamp-1">
              {country.timezones || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
