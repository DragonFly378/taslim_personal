export interface CityData {
  name: string
  country: string
}

export interface CountryData {
  name: string
  code: string
  cities: string[]
}

export const countries: CountryData[] = [
  {
    name: 'Indonesia',
    code: 'ID',
    cities: [
      'Jakarta',
      'Surabaya',
      'Bandung',
      'Medan',
      'Semarang',
      'Makassar',
      'Palembang',
      'Tangerang',
      'Depok',
      'Bekasi',
      'Bogor',
      'Malang',
      'Yogyakarta',
      'Balikpapan',
      'Banjarmasin',
      'Pontianak',
      'Denpasar',
      'Samarinda',
      'Batam',
      'Pekanbaru',
      'Jambi',
      'Padang',
      'Manado',
      'Solo',
      'Cirebon',
      'Tasikmalaya',
      'Serang',
      'Mataram',
      'Kupang',
      'Jayapura',
      'Banda Aceh',
      'Bengkulu',
      'Palu',
      'Ambon',
      'Ternate',
      'Kendari',
      'Gorontalo',
      'Mamuju',
      'Sofifi'
    ]
  },
  {
    name: 'Malaysia',
    code: 'MY',
    cities: [
      'Kuala Lumpur',
      'George Town',
      'Ipoh',
      'Shah Alam',
      'Petaling Jaya',
      'Johor Bahru',
      'Malacca',
      'Kuching',
      'Kota Kinabalu',
      'Seremban',
      'Kuantan',
      'Kota Bharu',
      'Alor Setar',
      'Kangar',
      'Kuala Terengganu'
    ]
  },
  {
    name: 'Singapore',
    code: 'SG',
    cities: ['Singapore']
  },
  {
    name: 'United States',
    code: 'US',
    cities: [
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Phoenix',
      'Philadelphia',
      'San Antonio',
      'San Diego',
      'Dallas',
      'San Jose',
      'Austin',
      'Jacksonville',
      'Fort Worth',
      'Columbus',
      'Charlotte',
      'San Francisco',
      'Indianapolis',
      'Seattle',
      'Denver',
      'Washington',
      'Boston',
      'Detroit',
      'Nashville',
      'Memphis',
      'Portland',
      'Oklahoma City',
      'Las Vegas',
      'Baltimore',
      'Milwaukee',
      'Albuquerque',
      'Tucson',
      'Fresno',
      'Sacramento',
      'Kansas City',
      'Miami',
      'Atlanta',
      'Orlando'
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    cities: [
      'London',
      'Birmingham',
      'Manchester',
      'Glasgow',
      'Liverpool',
      'Leeds',
      'Sheffield',
      'Edinburgh',
      'Bristol',
      'Cardiff',
      'Leicester',
      'Belfast',
      'Nottingham',
      'Newcastle',
      'Brighton',
      'Southampton',
      'Cambridge',
      'Oxford'
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    cities: [
      'Riyadh',
      'Jeddah',
      'Mecca',
      'Medina',
      'Dammam',
      'Khobar',
      'Dhahran',
      'Taif',
      'Tabuk',
      'Buraidah',
      'Khamis Mushait',
      'Hail',
      'Najran',
      'Abha',
      'Yanbu',
      'Al Jubail'
    ]
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    cities: [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Umm Al Quwain',
      'Al Ain'
    ]
  },
  {
    name: 'Turkey',
    code: 'TR',
    cities: [
      'Istanbul',
      'Ankara',
      'Izmir',
      'Bursa',
      'Antalya',
      'Adana',
      'Gaziantep',
      'Konya',
      'Kayseri',
      'Diyarbakir',
      'Mersin',
      'Eskisehir'
    ]
  },
  {
    name: 'Egypt',
    code: 'EG',
    cities: [
      'Cairo',
      'Alexandria',
      'Giza',
      'Shubra El Kheima',
      'Port Said',
      'Suez',
      'Luxor',
      'Mansoura',
      'Tanta',
      'Asyut',
      'Ismailia',
      'Faiyum',
      'Zagazig',
      'Aswan',
      'Hurghada'
    ]
  }
]

export const getCountryByCode = (code: string): CountryData | undefined => {
  return countries.find(c => c.code === code)
}

export const getCountryByName = (name: string): CountryData | undefined => {
  return countries.find(c => c.name.toLowerCase() === name.toLowerCase())
}

export const getCitiesByCountry = (countryName: string): string[] => {
  const country = getCountryByName(countryName)
  return country ? country.cities : []
}
