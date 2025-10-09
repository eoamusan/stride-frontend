import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

function PhoneNumberInput({ className, ...props }) {
  const [countries, setCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredCountries, setFilteredCountries] = React.useState([]);
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2'
        );
        const data = await response.json();

        const formattedCountries = data
          .filter((country) => country.idd?.root && country.idd?.suffixes?.[0])
          .map((country) => ({
            name: country.name.common,
            flag: country.flags.svg,
            code: `${country.idd.root}${country.idd.suffixes.length > 1 ? '' : country.idd.suffixes[0]}`,
            cca2: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        setFilteredCountries(formattedCountries);

        // Set Nigeria as default if available
        const nigeria = formattedCountries.find(
          (country) => country.cca2 === 'NG'
        );
        if (nigeria) {
          setSelectedCountry(nigeria);
        } else if (formattedCountries.length > 0) {
          setSelectedCountry(formattedCountries[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  React.useEffect(() => {
    if (searchQuery === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchQuery('');
    if (!isDropdownOpen) {
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');

    // If there's a phone number, update the complete value with new country code
    if (phoneNumber && props.onChange) {
      const completeValue = `${country.code} ${phoneNumber}`;
      const syntheticEvent = {
        target: { value: completeValue },
        currentTarget: { value: completeValue },
      };
      props.onChange(syntheticEvent);
    }
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    setPhoneNumber(inputValue);

    if (props.onChange && selectedCountry) {
      // Append country code to the phone number
      const completeValue = `${selectedCountry.code + (inputValue.startsWith('0') ? inputValue.slice(1) : inputValue)}`;
      console.log(completeValue);
      const syntheticEvent = {
        target: { value: completeValue },
        currentTarget: { value: completeValue },
      };
      props.onChange(syntheticEvent);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
      >
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={handleDropdownToggle}
            className="flex h-full items-center border-r border-gray-200 px-2 py-1 hover:bg-gray-50 focus:outline-none"
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-6 animate-pulse rounded bg-gray-200"></div>
            ) : selectedCountry ? (
              <div
                className="h-6 w-6 rounded-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${selectedCountry.flag})` }}
              />
            ) : (
              <div className="h-6 w-6 rounded bg-gray-200"></div>
            )}
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 max-h-64 w-64 rounded-md border border-gray-200 bg-white shadow-lg">
              {/* Search Input */}
              <div className="sticky top-0 border-b border-gray-200 bg-white p-2">
                <Input
                  ref={searchInputRef}
                  size={'sm'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                />
              </div>

              {/* Countries List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.cca2}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="flex w-full items-center px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div
                        className="mr-1.5 h-6 w-6 rounded-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${country.flag})` }}
                      />
                      <span className="flex-1 text-sm">{country.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {country.code}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center p-3 text-sm text-gray-500">
                    {searchQuery
                      ? 'No countries found'
                      : 'No countries available'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Country Code Display */}
        <div className="flex items-center px-2 text-sm text-gray-600">
          {selectedCountry?.code || '+234'}
        </div>

        {/* Phone Number Input */}
        <input
          typeof="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="flex-1 bg-transparent py-1 pr-3 text-base outline-none md:text-sm"
          data-slot={props['data-slot']}
          name={props.name}
          id={props.id}
          aria-describedby={props['aria-describedby']}
        />
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

function PasswordInput({ className, ...props }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}

export { Input, PhoneNumberInput, PasswordInput };
