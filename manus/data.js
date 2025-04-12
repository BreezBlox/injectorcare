// Common business data
const businesses = [
    {
        id: 1,
        name: "Elite Injector Services",
        location: "Chicago, IL",
        rating: 5,
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Elite Injector Services has been providing professional fuel injector cleaning and testing services since 2005. They specialize in ultrasonic cleaning and precision flow testing for all types of fuel injectors.",
        address: "123 Auto Row, Chicago, IL 60601",
        phone: "(312) 555-1234",
        website: "https://www.eliteinjectorservices.com",
        services: ["Ultrasonic Cleaning", "Flow Testing", "Injector Rebuilding", "Performance Tuning"]
    },
    {
        id: 2,
        name: "Precision Fuel Systems",
        location: "Dallas, TX",
        rating: 5,
        image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Precision Fuel Systems offers comprehensive fuel system services with a focus on injector cleaning and diagnostics. Their state-of-the-art equipment ensures optimal performance restoration for all vehicle makes and models.",
        address: "456 Mechanic Street, Dallas, TX 75201",
        phone: "(214) 555-5678",
        website: "https://www.precisionfuelsystems.com",
        services: ["Fuel System Cleaning", "Injector Testing", "Diagnostic Services", "Component Replacement"]
    },
    {
        id: 3,
        name: "Advanced Injector Clinic",
        location: "Los Angeles, CA",
        rating: 4,
        image: "https://images.unsplash.com/photo-1530046339915-78cc6c4812a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Advanced Injector Clinic specializes in high-performance and exotic vehicle fuel systems. Their technicians are factory-trained and use OEM-approved cleaning methods to restore injector performance.",
        address: "789 Performance Drive, Los Angeles, CA 90001",
        phone: "(323) 555-9012",
        website: "https://www.advancedinjector.com",
        services: ["Performance Injector Service", "Race Preparation", "Exotic Vehicle Specialists", "Custom Tuning"]
    },
    {
        id: 4,
        name: "Fuel System Specialists",
        location: "Miami, FL",
        rating: 4,
        image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Fuel System Specialists provides comprehensive fuel injector cleaning and testing services for both domestic and import vehicles. They offer same-day service and a 90-day warranty on all work.",
        address: "101 Marina Way, Miami, FL 33101",
        phone: "(305) 555-3456",
        website: "https://www.fuelsystemspecialists.com",
        services: ["Same-Day Service", "Import Specialists", "Mobile Service", "Fleet Services"]
    },
    {
        id: 5,
        name: "Injector Pros",
        location: "Seattle, WA",
        rating: 5,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Injector Pros has been the Pacific Northwest's premier fuel injector service center since 2001. They offer complete cleaning, testing, and rebuilding services with industry-leading warranty coverage.",
        address: "202 Tech Boulevard, Seattle, WA 98101",
        phone: "(206) 555-7890",
        website: "https://www.injectorpros.com",
        services: ["Complete Injector Rebuilding", "Pattern Testing", "Diesel Specialists", "Extended Warranty"]
    },
    {
        id: 6,
        name: "Clean Flow Injector Service",
        location: "Denver, CO",
        rating: 4,
        image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Clean Flow specializes in high-altitude fuel system optimization. Their unique cleaning process is designed to address the specific challenges of vehicles operating in mountain environments.",
        address: "303 Mountain View Road, Denver, CO 80201",
        phone: "(303) 555-1234",
        website: "https://www.cleanflowinjectors.com",
        services: ["High-Altitude Tuning", "Cold Weather Optimization", "4x4 Specialists", "Emissions Testing"]
    },
    {
        id: 7,
        name: "Ultrasonic Injector Cleaning",
        location: "Atlanta, GA",
        rating: 5,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Ultrasonic Injector Cleaning uses advanced ultrasonic technology to provide the most thorough cleaning possible. Their multi-stage process removes even the most stubborn deposits from all types of injectors.",
        address: "404 Service Center Lane, Atlanta, GA 30301",
        phone: "(404) 555-5678",
        website: "https://www.ultrasonicinjector.com",
        services: ["Multi-Stage Cleaning", "Before/After Flow Testing", "Pintle Polishing", "Nozzle Reconditioning"]
    },
    {
        id: 8,
        name: "Performance Fuel Systems",
        location: "Phoenix, AZ",
        rating: 4,
        image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Performance Fuel Systems specializes in performance and racing applications. Their services include precision flow matching and custom tuning for maximum power and efficiency.",
        address: "505 Horsepower Drive, Phoenix, AZ 85001",
        phone: "(602) 555-9012",
        website: "https://www.performancefuelsystems.com",
        services: ["Racing Preparation", "Flow Matching", "Custom Tuning", "Dyno Testing"]
    },
    {
        id: 9,
        name: "Fuel Injection Experts",
        location: "Boston, MA",
        rating: 5,
        image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Fuel Injection Experts provides comprehensive fuel system services with a focus on European vehicles. Their technicians are factory-trained on BMW, Mercedes, Audi, and other premium European brands.",
        address: "606 European Auto Way, Boston, MA 02101",
        phone: "(617) 555-3456",
        website: "https://www.fuelinjectionexperts.com",
        services: ["European Specialists", "Factory Diagnostic Equipment", "OEM Parts", "Coding & Programming"]
    },
    {
        id: 10,
        name: "Injector Cleaning Lab",
        location: "Philadelphia, PA",
        rating: 4,
        image: "https://images.unsplash.com/photo-1599394022918-6c2776530abb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Injector Cleaning Lab takes a scientific approach to fuel system maintenance. Their laboratory-grade equipment provides precise measurements and testing to ensure optimal injector performance.",
        address: "707 Science Park Drive, Philadelphia, PA 19101",
        phone: "(215) 555-7890",
        website: "https://www.injectorcleaninglab.com",
        services: ["Laboratory Testing", "Spray Pattern Analysis", "Electrical Testing", "Research & Development"]
    },
    {
        id: 11,
        name: "Precision Injector Service",
        location: "Houston, TX",
        rating: 5,
        image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Precision Injector Service specializes in diesel and heavy-duty applications. Their industrial-grade equipment can handle everything from pickup trucks to commercial fleet vehicles.",
        address: "808 Diesel Drive, Houston, TX 77001",
        phone: "(713) 555-1234",
        website: "https://www.precisioninjectorservice.com",
        services: ["Diesel Specialists", "Heavy-Duty Applications", "Fleet Services", "Commercial Vehicles"]
    },
    {
        id: 12,
        name: "Flow Test Specialists",
        location: "San Francisco, CA",
        rating: 4,
        image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Flow Test Specialists focuses on precision flow testing and matching services. Their proprietary testing equipment provides the most accurate measurements in the industry.",
        address: "909 Tech Circle, San Francisco, CA 94101",
        phone: "(415) 555-5678",
        website: "https://www.flowtestspecialists.com",
        services: ["Flow Rate Testing", "Injector Matching", "Spray Pattern Analysis", "Custom Calibration"]
    },
    {
        id: 13,
        name: "Injector Cleaning Depot",
        location: "Detroit, MI",
        rating: 5,
        image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Injector Cleaning Depot is located in the heart of America's automotive industry. Their connections with OEM manufacturers ensure they have the latest technical information and equipment.",
        address: "1010 Motor City Boulevard, Detroit, MI 48201",
        phone: "(313) 555-9012",
        website: "https://www.injectorcleaning.com",
        services: ["OEM Procedures", "Factory Training", "Technical Research", "Industry Partnerships"]
    },
    {
        id: 14,
        name: "Fuel System Restoration",
        location: "Portland, OR",
        rating: 4,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Fuel System Restoration takes a holistic approach to fuel system maintenance. Their comprehensive service addresses all components from the tank to the combustion chamber.",
        address: "1111 Green Street, Portland, OR 97201",
        phone: "(503) 555-3456",
        website: "https://www.fuelsystemrestoration.com",
        services: ["Complete System Cleaning", "Tank Cleaning", "Line Flushing", "Preventative Maintenance"]
    },
    {
        id: 15,
        name: "Injector Cleaning Solutions",
        location: "Minneapolis, MN",
        rating: 5,
        image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Injector Cleaning Solutions specializes in cold weather fuel system optimization. Their services help prevent fuel system issues common in extreme winter conditions.",
        address: "1212 Winter Way, Minneapolis, MN 55401",
        phone: "(612) 555-7890",
        website: "https://www.injectorsolutions.com",
        services: ["Cold Weather Specialists", "Winter Preparation", "Anti-Gel Treatments", "Moisture Removal"]
    },
    {
        id: 16,
        name: "Pro Injector Services",
        location: "San Diego, CA",
        rating: 4,
        image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Pro Injector Services caters to the marine and powersports markets. Their specialized equipment and procedures address the unique challenges of watercraft and recreational vehicles.",
        address: "1313 Marina Drive, San Diego, CA 92101",
        phone: "(619) 555-1234",
        website: "https://www.proinjectorservices.com",
        services: ["Marine Specialists", "Powersports", "Watercraft", "Recreational Vehicles"]
    }
];

// Cities for search suggestions
const cities = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", 
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
    "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
    "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
    "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Portland, OR",
    "Memphis, TN", "Oklahoma City, OK", "Las Vegas, NV", "Louisville, KY", "Baltimore, MD",
    "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
    "Kansas City, MO", "Long Beach, CA", "Mesa, AZ", "Atlanta, GA", "Colorado Springs, CO",
    "Raleigh, NC", "Omaha, NE", "Miami, FL", "Oakland, CA", "Minneapolis, MN",
    "Tulsa, OK", "Cleveland, OH", "Wichita, KS", "Arlington, TX", "New Orleans, LA"
];

// Export the data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        businesses,
        cities
    };
}
