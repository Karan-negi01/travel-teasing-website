require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set. Make sure .env.local exists.');
  process.exit(1);
}

const packages = [
  {
    slug: 'kasol-parvati-group',
    title: 'Kasol Parvati Valley Group Trip',
    location: 'Kasol',
    state: 'Himachal Pradesh',
    category: 'group',
    duration_days: 5,
    duration_nights: 4,
    group_size_min: 8,
    group_size_max: 10,
    price_per_person: 8000,
    total_price: 80000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    gallery_images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    ],
    best_time_to_visit: 'October to June',
    description: 'Escape to the enchanting Parvati Valley with our curated group trip to Kasol — the "Amsterdam of India." Nestled along the Parvati River surrounded by towering pine forests and snow-capped Himalayan peaks, Kasol is a paradise for backpackers, nature lovers, and anyone seeking peace away from the chaos of city life. This 5-day group journey is designed for like-minded travelers who want to explore the valley\'s hidden gems, trek through ancient villages, and create memories that last a lifetime.',
    highlights: [
      'Scenic trek to Kheerganga hot springs',
      'Explore the charming village of Chalal',
      'Visit the ancient Manikaran Gurudwara & hot springs',
      'Bonfire nights by the Parvati River',
      'Vibrant café culture and Israeli food scene in Kasol',
    ],
    inclusions: [
      'AC Volvo bus from Delhi (both ways)',
      '4 nights accommodation (twin/triple sharing)',
      'Daily breakfast and dinner',
      'Kheerganga trek with experienced guide',
      'Manikaran sightseeing',
      'All transfers within the valley',
      'First aid kit & safety briefing',
    ],
    exclusions: [
      'Lunch and personal snacks',
      'Entry fees to monuments',
      'Personal travel insurance',
      'Tips and gratuities',
      'Alcoholic beverages',
      'Any cost arising due to natural calamity',
    ],
    things_to_carry: [
      'Warm layers (fleece/down jacket)',
      'Trekking shoes with good grip',
      'Rain poncho or waterproof jacket',
      'Personal medicines and basic first aid',
      'Water bottle (2L minimum)',
      'Sunscreen SPF 50+ and sunglasses',
      'Torch/headlamp with extra batteries',
      'Valid government photo ID',
    ],
    itinerary: [
      { day: 1, title: 'Delhi Departure — Night Journey Begins', description: 'Meet your travel squad at Kashmere Gate ISBT at 6 PM. Board your AC Volvo coach and get comfortable for the overnight journey. Our team will do introductions and share the trip itinerary. Dinner stop at a dhaba en route.' },
      { day: 2, title: 'Arrive Kasol — River Walks & Chalal Village', description: 'Arrive Kasol by morning and check into your riverside guesthouse. After freshening up, explore the Kasol market — try Israeli breakfast cafés. Post lunch, take a 2 km leisure walk to the charming village of Chalal. Evening bonfire by the Parvati River. Dinner together.' },
      { day: 3, title: 'Kheerganga Trek — Hot Springs & Mountain Tops', description: 'Early morning breakfast and begin the 12 km trek to Kheerganga (2950m). The trail passes through dense forests, open meadows, and small waterfalls. Reach Kheerganga by afternoon and soak in the natural hot springs. Camp under a million stars. Dinner at the top.' },
      { day: 4, title: 'Kheerganga to Kasol — Manikaran Visit', description: 'Post breakfast, trek back to Nakthan village and transfer to Manikaran. Visit the sacred Gurudwara Manikaran Sahib and bathe in the holy hot springs. Enjoy langar (community meal) at the Gurudwara. Evening back at Kasol. Group dinner and farewell bonfire.' },
      { day: 5, title: 'Kasol to Delhi — Memories in the Bag', description: 'After breakfast, check out by 10 AM. Begin the drive back to Delhi. Stop for lunch en route. Arrive Delhi by late evening with a heart full of stories and a phone full of photos.' },
    ],
  },
  {
    slug: 'spiti-valley-expedition',
    title: 'Spiti Valley Expedition',
    location: 'Spiti Valley',
    state: 'Himachal Pradesh',
    category: 'group',
    duration_days: 8,
    duration_nights: 7,
    group_size_min: 8,
    group_size_max: 12,
    price_per_person: 14000,
    total_price: 168000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    gallery_images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    ],
    best_time_to_visit: 'June to October',
    description: 'The "Middle Land" between India and Tibet — Spiti Valley is one of the most raw, untouched, and surreal landscapes on Earth. At 12,000+ feet above sea level, the cold desert terrain of Spiti will leave you speechless with its lunar landscapes, ancient Buddhist monasteries, and warm-hearted tribal communities. This 8-day expedition is for those who want more than a vacation — they want a transformation.',
    highlights: [
      'Visit 1000-year-old Key Monastery — the largest in Spiti',
      'Drive across the mighty Kunzum Pass (4590m)',
      'Explore the fossil site at Langza — 50 million year old marine fossils',
      'Overnight in mud homes with local Spitian families',
      'Chandrataal Lake — the Moon Lake at 14,100 ft',
    ],
    inclusions: [
      'AC Volvo from Delhi to Shimla + Tempo Traveller for entire Spiti circuit',
      '7 nights accommodation (guesthouses & homestays)',
      'All meals (breakfast + dinner)',
      'Expert local guide fluent in Hindi',
      'All inner line permits',
      'Oxygen cylinders for altitude emergencies',
      'First aid and acclimatization support',
    ],
    exclusions: [
      'Lunch',
      'Personal expenses and shopping',
      'Travel insurance (highly recommended)',
      'Tips to driver and guide',
      'Any medical costs',
    ],
    things_to_carry: [
      'Heavy winter jacket and thermal innerwear',
      'Sturdy trekking boots',
      'Woolen socks and gloves',
      'Altitude sickness medicine (Diamox — consult doctor)',
      'Personal medications and doctor prescription',
      'Sunscreen SPF 100, lip balm',
      'Water purification tablets',
      'Power bank (charging facilities limited)',
      'Valid government photo ID',
      'Cash (ATMs scarce in Spiti)',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Shimla — Night Drive', description: 'Board the AC Volvo from Delhi at 7 PM. Overnight journey to Shimla.' },
      { day: 2, title: 'Shimla to Narkanda to Rampur', description: 'Arrive Shimla morning. Continue drive through apple orchards of Narkanda. Reach Rampur by evening. Dinner and overnight at hotel.' },
      { day: 3, title: 'Rampur to Kaza via Nako', description: 'Early start to reach Kaza, the headquarters of Spiti. En route visit Nako Lake and the ancient Nako Monastery. Arrive Kaza evening. Acclimatization walk. Dinner and overnight.' },
      { day: 4, title: 'Kaza Local Exploration — Key, Kibber, Langza', description: 'After breakfast, visit the iconic Key Monastery. Drive to Kibber village — one of the highest motorable villages in the world. Then to Langza to see the 50 million year old marine fossils and the Buddha statue overlooking the valley.' },
      { day: 5, title: 'Kaza to Tabo — Valley of Flowers', description: 'Morning drive to Tabo, home to a 1000-year-old monastery complex. Explore the ancient murals and sculptures. Visit the meditation caves in the cliff face. Overnight at Tabo.' },
      { day: 6, title: 'Tabo to Dhankar — Mud Monastery', description: 'Visit the precariously perched Dhankar Monastery. Hike to Dhankar Lake for panoramic views. Continue to Pin Valley National Park. Overnight at guesthouse.' },
      { day: 7, title: 'Chandrataal Lake — Moon Lake', description: 'Drive to the ethereal Chandrataal Lake at 14,100 feet. Trek around the turquoise waters surrounded by peaks. This is the highlight of the trip. Return to Kaza. Farewell dinner.' },
      { day: 8, title: 'Kaza to Delhi — Homeward Bound', description: 'Early morning start. Drive through Kunzum Pass and Rohtang back to Manali. Overnight Volvo from Manali to Delhi.' },
    ],
    highlights: [
      'Visit 1000-year-old Key Monastery — largest in Spiti',
      'Chandrataal Lake — the turquoise Moon Lake at 14,100 ft',
      'Drive across the mighty Kunzum Pass at 4590m',
      'Marine fossils at Langza — 50 million years old',
      'Authentic homestay with Spitian families',
    ],
    inclusions: [
      'AC Volvo Delhi to Shimla + Tempo Traveller for Spiti circuit',
      '7 nights accommodation (guesthouses + homestays)',
      'All meals — breakfast and dinner',
      'Expert local guide',
      'All inner line permits',
      'Oxygen cylinders for emergencies',
      'First aid and acclimatization support',
    ],
    exclusions: [
      'Lunch',
      'Personal expenses',
      'Travel insurance (highly recommended)',
      'Tips to driver and guide',
    ],
    things_to_carry: [
      'Heavy winter jacket and thermals',
      'Sturdy trekking boots',
      'Altitude sickness medicine (consult doctor)',
      'Sunscreen SPF 100 and lip balm',
      'Power bank',
      'Cash (ATMs are scarce)',
      'Valid government photo ID',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Shimla — Night Drive', description: 'Board the AC Volvo from Delhi at 7 PM. Overnight journey to Shimla.' },
      { day: 2, title: 'Shimla to Rampur', description: 'Arrive Shimla. Drive through apple orchards to Rampur. Dinner and overnight.' },
      { day: 3, title: 'Rampur to Kaza via Nako', description: 'Drive to Kaza. En route visit Nako Lake and ancient monastery. Acclimatization rest.' },
      { day: 4, title: 'Key Monastery, Kibber & Langza', description: 'Visit iconic Key Monastery, Kibber village, and the fossil site at Langza.' },
      { day: 5, title: 'Kaza to Tabo', description: 'Drive to Tabo. Explore the 1000-year-old monastery complex and meditation caves.' },
      { day: 6, title: 'Tabo to Dhankar', description: 'Visit Dhankar Monastery and hike to Dhankar Lake. Pin Valley National Park.' },
      { day: 7, title: 'Chandrataal Lake', description: 'Drive to the ethereal Chandrataal at 14,100 ft. Trek around the turquoise waters.' },
      { day: 8, title: 'Return to Delhi', description: 'Drive via Kunzum Pass and Rohtang to Manali. Overnight Volvo to Delhi.' },
    ],
  },
  {
    slug: 'ladakh-road-adventure',
    title: 'Ladakh Road Adventure',
    location: 'Leh Ladakh',
    state: 'Jammu & Kashmir',
    category: 'group',
    duration_days: 9,
    duration_nights: 8,
    group_size_min: 8,
    group_size_max: 10,
    price_per_person: 18000,
    total_price: 180000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800',
    gallery_images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    ],
    best_time_to_visit: 'June to September',
    description: 'Ladakh — the Land of High Passes — is arguably the most spectacular destination in India. From the otherworldly Pangong Lake to the world\'s highest motorable pass at Khardung La, from ancient monasteries to sand dunes in the middle of mountains, Ladakh is a journey that rewires your soul. This 9-day road adventure covers all the iconic stops while keeping the group spirit alive.',
    highlights: [
      'Pangong Tso Lake — the iconic blue lake from 3 Idiots',
      'Khardung La Pass — world\'s highest motorable road at 18,380 ft',
      'Nubra Valley and Bactrian camel ride on sand dunes',
      'Magnetic Hill and Gurudwara Patthar Sahib',
      'Authentic Ladakhi monastery visits at Hemis and Thiksey',
    ],
    inclusions: [
      'Delhi–Leh–Delhi flights (economy class)',
      '8 nights accommodation (hotels + camps)',
      'All meals (breakfast + dinner)',
      'Innova/Tempo Traveller for all transfers',
      'Expert English/Hindi speaking guide',
      'All monastery and monument entry fees',
      'Inner Line Permits for restricted areas',
      'Oxygen support',
    ],
    exclusions: [
      'Lunch',
      'Personal spending and shopping',
      'Travel insurance',
      'Camel ride at Nubra Valley',
      'Tips',
    ],
    things_to_carry: [
      'Heavy jacket and windproof layer',
      'Sunscreen SPF 100 and UV protection sunglasses',
      'Altitude sickness medication',
      'Comfortable walking shoes',
      'Camera with extra batteries',
      'Valid government ID (passport preferred for restricted areas)',
      'Cash (ATMs available in Leh only)',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Leh — Fly In', description: 'Morning flight to Leh (3500m). Hotel check-in. Rest day for acclimatization — very important. Light walk in Leh market. Early dinner and sleep.' },
      { day: 2, title: 'Leh Acclimatization — Local Sightseeing', description: 'Shanti Stupa sunrise walk. Leh Palace. Hall of Fame War Museum. Magnetic Hill. Gurudwara Patthar Sahib. Evening free in Leh market.' },
      { day: 3, title: 'Leh to Nubra Valley via Khardung La', description: 'Drive over Khardung La (18,380 ft) — the world\'s highest motorable pass. Descend to Nubra Valley. Afternoon camel ride on the sand dunes at Hunder. Overnight in luxury tents.' },
      { day: 4, title: 'Nubra Valley — Diskit Monastery', description: 'Visit Diskit Monastery and the giant Maitreya Buddha statue overlooking Nubra. Explore the valley. Return to Leh via Khardung La. Overnight at hotel.' },
      { day: 5, title: 'Leh to Pangong Lake', description: 'Drive to Pangong Tso (4350m) — 5 hours through dramatic mountain passes. First sight of the iconic blue lake. Check into lakeside camps. Sunset at the lake.' },
      { day: 6, title: 'Pangong — Full Day at the Lake', description: 'Sunrise at Pangong — unmissable. Morning at leisure — walk along the shores, photography. Afternoon drive to Spangmik village. Overnight at camp under the stars.' },
      { day: 7, title: 'Pangong to Leh via Hemis', description: 'Return to Leh. En route visit Hemis Monastery — the largest in Ladakh, hosting the famous Hemis Festival. Also stop at Thiksey Monastery. Evening free in Leh.' },
      { day: 8, title: 'Leh Free Day — Leisure & Shopping', description: 'Day at leisure. Optional rafting on the Indus River (extra cost). Shop for Pashmina shawls, turquoise jewelry, and thangka paintings. Group farewell dinner.' },
      { day: 9, title: 'Leh to Delhi — Homeward', description: 'Morning flight back to Delhi. Trip ends with memories of a lifetime.' },
    ],
  },
  {
    slug: 'rishikesh-weekend',
    title: 'Rishikesh Weekend Getaway',
    location: 'Rishikesh',
    state: 'Uttarakhand',
    category: 'group',
    duration_days: 3,
    duration_nights: 2,
    group_size_min: 6,
    group_size_max: 8,
    price_per_person: 4500,
    total_price: 36000,
    departure_city: 'Delhi',
    is_featured: false,
    cover_image: 'https://images.unsplash.com/photo-1585016495481-91613b19e2e8?w=800',
    best_time_to_visit: 'October to May',
    description: 'The perfect weekend escape from Delhi\'s madness — Rishikesh has it all. White-water rafting on the Ganga, bungee jumping from 83 meters, peaceful ashrams, Beatles Ashram, and the most beautiful evening Ganga Aarti you\'ll ever witness. This action-packed 3-day trip is designed to fit perfectly into a long weekend.',
    highlights: [
      'White-water rafting on the River Ganga',
      'Bungee jumping at Jumpin Heights (83m)',
      'Evening Ganga Aarti at Triveni Ghat',
      'Visit Beatles Ashram (Maharishi Mahesh Yogi Ashram)',
      'Yoga and meditation morning session',
    ],
    inclusions: [
      'AC bus from Delhi (both ways)',
      '2 nights accommodation (camp/hostel)',
      'Daily breakfast',
      'White-water rafting (16 km stretch)',
      'All transfers',
    ],
    exclusions: [
      'Lunch and dinner (except breakfast)',
      'Bungee jumping, zip lining (extra cost)',
      'Personal expenses',
    ],
    things_to_carry: [
      'Quick-dry clothes for rafting',
      'Spare set of clothes',
      'Sandals or flip flops',
      'Sunscreen and sunglasses',
      'Light daypack',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Rishikesh — Arrival & Ganga Aarti', description: 'Depart Delhi at 6 AM by AC bus. Arrive Rishikesh by noon. Check in and freshen up. Afternoon at Laxman Jhula and Ram Jhula. Evening, attend the magical Ganga Aarti at Triveni Ghat. Dinner at your own expense at the famous cafés on the banks of Ganga.' },
      { day: 2, title: 'Rafting, Adventure & Beatles Ashram', description: 'Early morning optional yoga session. Post breakfast, gear up for white-water rafting on the Ganges. After rafting and drying up, visit the Beatles Ashram where the Fab Four stayed in 1968. Afternoon free for bungee jumping (optional, extra cost). Evening by the river.' },
      { day: 3, title: 'Sunrise Yoga & Return to Delhi', description: 'Early morning sunrise yoga on the ghat. Breakfast. Check out by 10 AM. Drive back to Delhi. Arrive Delhi by early evening.' },
    ],
  },
  {
    slug: 'manali-family',
    title: 'Manali Family Holiday',
    location: 'Manali',
    state: 'Himachal Pradesh',
    category: 'family',
    duration_days: 5,
    duration_nights: 4,
    group_size_min: 4,
    group_size_max: 8,
    price_per_person: 9000,
    total_price: 72000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    best_time_to_visit: 'December to June',
    description: 'Manali is a dream destination for Indian families — snow-covered peaks, apple orchards, thrilling adventures for the kids, and peaceful walks for the parents. Our carefully designed family package ensures every member, from grandparents to toddlers, has a comfortable and joyful experience. We take care of every detail so you only focus on creating memories.',
    highlights: [
      'Snow play and snowball fights in Solang Valley',
      'Visit Hidimba Devi Temple — a 500-year-old wooden temple',
      'Kullu Valley sightseeing and river views',
      'Rohtang Pass (snow point) — conditions permitting',
      'Comfortable 4-star family hotel in Manali town',
    ],
    inclusions: [
      'Deluxe AC sleeper bus from Delhi (both ways)',
      '4 nights accommodation in family rooms (3-4 star hotel)',
      'Daily breakfast and dinner',
      'Volvo seating within Manali circuit',
      'Solang Valley visit with snow gear rental',
      'Hidimba Devi Temple, Old Manali sightseeing',
      'Rohtang Pass visit (weather permitting)',
    ],
    exclusions: [
      'Lunch',
      'Ropeway rides',
      'Personal expenses and shopping',
      'Horse riding',
    ],
    things_to_carry: [
      'Heavy winter jackets for entire family',
      'Woolen socks and waterproof gloves',
      'Snow boots (or rent at Solang Valley)',
      'Children\'s medications',
      'Warm woolen caps and scarves',
      'Camera',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Manali — Night Journey', description: 'Board the comfortable AC Volvo from Delhi at 5 PM. Overnight journey with family.' },
      { day: 2, title: 'Arrive Manali — Rest & Old Manali', description: 'Arrive Manali by morning. Hotel check-in. Afternoon visit Old Manali village and the famous Manu Temple. Evening stroll on Mall Road. Dinner at hotel.' },
      { day: 3, title: 'Solang Valley — Snow Day!', description: 'The most exciting day for kids! Drive to Solang Valley. Snow activities — snowman making, snowball fights, sledding. Lunch at Solang. Return by evening. Hot chocolate and bonfire at hotel.' },
      { day: 4, title: 'Rohtang Pass & Kullu Valley', description: 'Morning drive towards Rohtang Pass (snow point) — 13,050 ft. Snow play. Return to Manali via Kullu. Visit Kullu Shawl factory and Vaishno Devi Temple, Kullu. Dinner together.' },
      { day: 5, title: 'Hidimba Temple & Return to Delhi', description: 'Morning visit to the iconic Hidimba Devi Temple set in deodar forest. Shopping on Mall Road. Check out and board the bus back to Delhi. Arrive Delhi next morning.' },
    ],
  },
  {
    slug: 'coorg-family',
    title: 'Coorg Family Retreat',
    location: 'Coorg',
    state: 'Karnataka',
    category: 'family',
    duration_days: 4,
    duration_nights: 3,
    group_size_min: 4,
    group_size_max: 8,
    price_per_person: 12000,
    total_price: 96000,
    departure_city: 'Bangalore',
    is_featured: false,
    cover_image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
    best_time_to_visit: 'October to March',
    description: 'Known as the "Scotland of India," Coorg (Kodagu) is a lush green paradise of coffee plantations, misty hills, and waterfalls. This family retreat combines nature walks through coffee estates, visits to ancient temples, elephant encounters, and rejuvenating Ayurvedic experiences — all set in a private plantation resort.',
    highlights: [
      'Guided walk through working coffee and spice plantations',
      'Elephant camp interaction and feeding',
      'Abbey Falls and Iruppu Falls visits',
      'Traditional Coorgi cuisine experience',
      'Nagarhole National Park jungle safari',
    ],
    inclusions: [
      'Private cab from Bangalore both ways',
      '3 nights stay at plantation resort',
      'All meals (breakfast, lunch, dinner)',
      'Coffee plantation guided tour',
      'Abbey Falls visit',
      'Elephant camp visit',
    ],
    exclusions: [
      'Nagarhole safari (optional, extra cost)',
      'Ayurvedic spa',
      'Personal shopping',
    ],
    things_to_carry: [
      'Light cotton clothes',
      'Rain jacket or poncho (it can drizzle)',
      'Comfortable walking shoes',
      'Insect repellent',
      'Camera',
    ],
    itinerary: [
      { day: 1, title: 'Bangalore to Coorg', description: 'Early morning pickup from Bangalore. Arrive Coorg by noon. Resort check-in. Afternoon at leisure — explore the estate, fresh coffee aroma all around. Sunset walk. Dinner with traditional Coorgi pork curry and Kadumbuttu.' },
      { day: 2, title: 'Coffee Estate & Waterfalls', description: 'Morning guided coffee plantation walk — see how coffee is grown, processed and roasted. Visit a spice garden. Post lunch, drive to Abbey Falls. Evening bonfire at the resort with local music.' },
      { day: 3, title: 'Elephant Camp & Nagarhole', description: 'Morning visit to the elephant camp — feed and bathe the elephants. Children\'s favorite activity! Optional afternoon Nagarhole National Park jeep safari (extra cost). Evening Ayurvedic massage available.' },
      { day: 4, title: 'Return to Bangalore', description: 'Morning leisure. Breakfast. Check out. Drive back to Bangalore with boxes of fresh Coorg coffee and spices to take home.' },
    ],
  },
  {
    slug: 'rajasthan-royal',
    title: 'Rajasthan Royal Tour',
    location: 'Jaipur-Jodhpur-Udaipur',
    state: 'Rajasthan',
    category: 'family',
    duration_days: 7,
    duration_nights: 6,
    group_size_min: 4,
    group_size_max: 10,
    price_per_person: 15000,
    total_price: 150000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1477587458883-47145ed68a2c?w=800',
    best_time_to_visit: 'October to March',
    description: 'The Golden Triangle plus — a magnificent journey through the Land of Kings. From the Pink City of Jaipur with its magnificent forts to the Blue City of Jodhpur with the imposing Mehrangarh, and finally the romantic Lake City of Udaipur with its shimmering Lake Pichola. Rajasthan is a living museum of India\'s regal heritage, and this 7-day tour brings it all alive.',
    highlights: [
      'Amber Fort and elephant ride (jeep alternative for animal lovers)',
      'Mehrangarh Fort — Jodhpur\'s crown jewel',
      'Boat ride on Lake Pichola, Udaipur',
      'Sunset at Jaisalmer Sand Dunes (optional extension)',
      'Traditional Rajasthani thali dinner with folk music and dance',
    ],
    inclusions: [
      'Delhi to Jaipur by AC train (first class)',
      'Intercity AC cab for entire tour',
      'Udaipur to Delhi by flight',
      '6 nights heritage hotel accommodation',
      'Daily breakfast',
      'Expert historian guide throughout',
      'All monument entry fees',
    ],
    exclusions: [
      'Lunch and dinner (except one cultural dinner)',
      'Camel/elephant rides',
      'Personal shopping',
    ],
    things_to_carry: [
      'Comfortable cotton clothes (it can be warm)',
      'Light shawl for evenings',
      'Comfortable walking shoes',
      'Sunscreen and sunglasses',
      'Camera for the stunning architecture',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Jaipur — The Pink City Arrives', description: 'AC train to Jaipur in the morning. Hotel check-in. Afternoon visit the City Palace and Jantar Mantar. Evening at Johari Bazaar and Bapu Bazaar. Welcome dinner with Rajasthani thali.' },
      { day: 2, title: 'Amber Fort & Hawa Mahal', description: 'Morning jeep ride to the magnificent Amber Fort — explore its ornate rooms and mirror palace. Visit Hawa Mahal (Palace of Winds). Nahargarh Fort for sunset and city views. Return to hotel.' },
      { day: 3, title: 'Jaipur to Jodhpur — The Blue City', description: 'Drive to Jodhpur (5 hours). Check in. Evening visit the famous Clock Tower market for blue pottery and silver jewelry. Dinner overlooking the blue city.' },
      { day: 4, title: 'Mehrangarh Fort & Umaid Bhawan', description: 'Morning at the imposing Mehrangarh Fort — one of India\'s largest forts with panoramic views. Visit Umaid Bhawan Palace museum. Afternoon Jaswant Thada — the marble cenotaph. Drive towards Udaipur.' },
      { day: 5, title: 'Arrive Udaipur — City of Lakes', description: 'Arrive Udaipur by noon. Hotel check-in. Afternoon Fateh Sagar Lake boat ride. Saheliyon Ki Bari garden. Sunset at Monsoon Palace. Dinner at a rooftop restaurant overlooking Lake Pichola.' },
      { day: 6, title: 'Udaipur Full Day — City Palace & Lake Pichola', description: 'Morning visit to the grand City Palace complex. Boat ride on Lake Pichola to Jag Mandir. Afternoon at leisure — Bagore Ki Haveli, folk dance show in the evening. Shopping at Hathipole Bazaar.' },
      { day: 7, title: 'Udaipur to Delhi — Farewell Rajasthan', description: 'Morning at leisure. Breakfast. Check out and transfer to airport. Flight back to Delhi. Journey ends with royal memories.' },
    ],
  },
  {
    slug: 'char-dham-yatra',
    title: 'Char Dham Yatra',
    location: 'Char Dham',
    state: 'Uttarakhand',
    category: 'sacred',
    duration_days: 12,
    duration_nights: 11,
    group_size_min: 10,
    group_size_max: 20,
    price_per_person: 22000,
    total_price: 440000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800',
    best_time_to_visit: 'May to June, September to October',
    description: 'Undertake one of Hinduism\'s most sacred pilgrimages — the Char Dham Yatra. Visit all four divine abodes: Yamunotri (source of Yamuna river), Gangotri (source of Ganga river), Kedarnath (Shiva\'s seat in the Himalayas), and Badrinath (abode of Lord Vishnu). This soul-stirring 12-day journey takes you through the sacred Garhwal Himalayas, offering divine darshan, spiritual renewal, and breathtaking natural beauty.',
    highlights: [
      'Darshan at all four sacred Char Dhams in one yatra',
      'Kedarnath Jyotirlinga — one of the 12 sacred Jyotirlingas',
      'Helicopter option for Kedarnath (extra cost)',
      'Holy dip at the source of River Ganga at Gangotri',
      'Badrinath — abode of Lord Vishnu at 10,170 ft',
    ],
    inclusions: [
      'Delhi pickup and drop-off by AC coach',
      '11 nights accommodation (hotels and dharamshalas)',
      'All meals (breakfast + dinner)',
      'All road transfers in AC tempo traveller',
      'Pony/doli arrangements for elderly at Kedarnath',
      'Experienced yatra guide with religious knowledge',
      'All registration and permit fees',
    ],
    exclusions: [
      'Helicopter charges for Kedarnath',
      'Pooja and prasad expenses',
      'Personal expenses',
      'Lunch',
      'Porter charges above included allowance',
    ],
    things_to_carry: [
      'Warm clothes (it\'s cold even in summer)',
      'Walking stick for treks',
      'Personal medications especially for heart patients',
      'Comfortable trekking shoes',
      'Rain gear',
      'Small backpack for trek days',
      'Photo ID and multiple photocopies',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Haridwar', description: 'Depart Delhi by AC bus. Arrive Haridwar by evening. Check in. Attend evening Ganga Aarti at Har Ki Pauri. Divine beginning to the sacred yatra.' },
      { day: 2, title: 'Haridwar to Barkot (Yamunotri Base)', description: 'Early morning departure. Drive to Barkot via Mussoorie. Arrive evening. Rest and preparation for next day\'s trek.' },
      { day: 3, title: 'Yamunotri Darshan', description: 'Trek 6 km to Yamunotri (3293m). Darshan at the sacred Yamunotri Temple. Take a dip in Surya Kund hot spring. Cook rice in the thermal spring as prasad. Return to Barkot.' },
      { day: 4, title: 'Barkot to Uttarkashi (Gangotri Base)', description: 'Drive to Uttarkashi via Dharasu. Check in. Explore the town. Visit Vishwanath Temple. Overnight at Uttarkashi.' },
      { day: 5, title: 'Gangotri Darshan', description: 'Drive to Gangotri (3100m) — holy source of River Ganga. Darshan at Gangotri Temple. Holy dip in the freezing Bhagirathi River. Return to Uttarkashi.' },
      { day: 6, title: 'Uttarkashi to Guptkashi', description: 'Long drive to Guptkashi via Tehri. Arrive evening. This is the base for Kedarnath. Rest and preparation.' },
      { day: 7, title: 'Kedarnath Trek — The Divine Climb', description: 'Early morning drive to Gaurikund. Begin the 16 km trek (or take helicopter — extra cost). Arrive Kedarnath. Overnight stay at the top to attend early morning darshan.' },
      { day: 8, title: 'Kedarnath Darshan & Descent', description: 'Early morning special pooja at the Kedarnath Temple. Darshan of the Jyotirlinga. Descend to Gaurikund. Drive to Rudraprayag. Overnight.' },
      { day: 9, title: 'Rudraprayag to Badrinath', description: 'Drive via the Alaknanda River valley. Pass through Chamoli and Joshimath. Arrive Badrinath by evening. Visit the Tapt Kund hot springs. Overnight.' },
      { day: 10, title: 'Badrinath Darshan', description: 'Early morning Abhishek and special darshan at Badrinath Temple. Visit Mana Village — the last Indian village before Tibet. Brahma Kapal. Vasundhara Falls. Return to hotel.' },
      { day: 11, title: 'Badrinath to Haridwar', description: 'Long drive back to Haridwar. Arrive evening. Last Ganga Aarti. Thanksgiving prayers. Farewell dinner.' },
      { day: 12, title: 'Haridwar to Delhi — Blessed Journey Home', description: 'After morning prayers at Har Ki Pauri, depart for Delhi. Arrive by evening. The Char Dham Yatra blessed and complete.' },
    ],
  },
  {
    slug: 'varanasi-spiritual',
    title: 'Varanasi Spiritual Journey',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'sacred',
    duration_days: 4,
    duration_nights: 3,
    group_size_min: 8,
    group_size_max: 15,
    price_per_person: 7000,
    total_price: 112000,
    departure_city: 'Delhi',
    is_featured: false,
    cover_image: 'https://images.unsplash.com/photo-1561361058-c24e022cefa6?w=800',
    best_time_to_visit: 'October to March',
    description: 'Varanasi — the eternal city, one of the world\'s oldest living cities, and the spiritual heart of Hinduism. This 4-day immersive journey takes you deep into the ghats, the bylanes, the temples, and the rituals that have continued unbroken for thousands of years. The experience of the Ganga Aarti at Dashashwamedh Ghat and the haunting beauty of Manikarnika Ghat at dawn will stay with you forever.',
    highlights: [
      'Early morning boat ride on the Ganges — the most magical experience',
      'Grand Ganga Aarti at Dashashwamedh Ghat',
      'Kashi Vishwanath Temple darshan',
      'Sarnath — where Buddha gave his first sermon',
      'Guided walk through ancient bylanes and ghats',
    ],
    inclusions: [
      'AC train from Delhi to Varanasi (both ways)',
      '3 nights heritage hotel near the ghats',
      'Daily breakfast',
      'Morning boat ride on Ganges (both days)',
      'Expert local guide for ghat walks',
      'Sarnath visit with guide',
      'Evening Ganga Aarti viewing',
    ],
    exclusions: [
      'Lunch and dinner',
      'Temple entry fees',
      'Personal shopping',
    ],
    things_to_carry: [
      'Modest clothing (covered knees and shoulders for temples)',
      'Comfortable walking sandals',
      'Light layers for early morning boat rides',
      'Stomach medicine (try street food carefully)',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Varanasi — Evening Arrival', description: 'Overnight train from Delhi. Arrive Varanasi morning. Hotel check-in. Afternoon rest. Evening attend the magnificent Ganga Aarti at Dashashwamedh Ghat — a spectacle like no other.' },
      { day: 2, title: 'Dawn on the Ganges — The Golden Hour', description: 'Wake up at 4:30 AM. Walk to the ghats. Boat ride as the sun rises over the Ganges — watch pilgrims bathe, priests perform rituals, and life unfold on the ghats. Visit Kashi Vishwanath Temple. Breakfast at the famous Blue Lassi Shop. Afternoon guided walk through the bylanes of the oldest part of the city.' },
      { day: 3, title: 'Sarnath — Where the Buddha Spoke', description: 'Morning boat ride again at dawn. Post breakfast, drive to Sarnath — just 10 km away. Visit Dhamek Stupa where Buddha gave his first sermon after enlightenment. Ashoka Pillar. Sarnath Archaeological Museum. Return to Varanasi. Evening at leisure — explore silk saree shops and street food.' },
      { day: 4, title: 'Final Morning & Return Journey', description: 'Optional sunrise boat ride. Breakfast. Check out. Transfer to Varanasi station. Board train back to Delhi. Carry the peace of Varanasi in your heart.' },
    ],
  },
  {
    slug: 'kedarnath-yatra',
    title: 'Kedarnath Yatra',
    location: 'Kedarnath',
    state: 'Uttarakhand',
    category: 'sacred',
    duration_days: 5,
    duration_nights: 4,
    group_size_min: 10,
    group_size_max: 20,
    price_per_person: 9500,
    total_price: 190000,
    departure_city: 'Delhi',
    is_featured: true,
    cover_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    best_time_to_visit: 'May to June, September to October',
    description: 'Kedarnath — one of the most powerful Jyotirlingas of Lord Shiva, set dramatically at 3553 meters in the Garhwal Himalayas. The journey to Kedarnath is itself a devotional experience — a 16 km trek through glacial streams, rhododendron forests, and mountain meadows, culminating in the ancient stone temple that has stood for over 1200 years. This is not just a trip — it is a pilgrimage.',
    highlights: [
      'Darshan at Kedarnath — the powerful Jyotirlinga',
      'Early morning Abhishek and special pooja at the temple',
      'Stay overnight at Kedarnath for the divine atmosphere at dawn',
      'Vasuki Tal lake — optional half day trek',
      'Triyuginarayan Temple — Lord Shiva\'s wedding venue',
    ],
    inclusions: [
      'Delhi to Haridwar by AC bus (both ways)',
      'Haridwar to Gaurikund by AC cab',
      '4 nights accommodation (hotel + Kedarnath dharamshala)',
      'Daily breakfast and dinner',
      'Ponies/doli arrangement for elderly at nominal extra cost',
      'Guide for the entire yatra',
    ],
    exclusions: [
      'Helicopter charges',
      'Pooja and prasad',
      'Personal expenses',
    ],
    things_to_carry: [
      'Warm clothes — temperature can drop to 0°C at Kedarnath',
      'Sturdy trekking shoes',
      'Walking stick',
      'Rain gear',
      'Personal medicines including heart medication',
      'Torch/headlamp',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Haridwar', description: 'Evening bus from Delhi. Arrive Haridwar. Check in. Attend Ganga Aarti. Overnight.' },
      { day: 2, title: 'Haridwar to Guptkashi', description: 'Early morning drive via Devprayag and Rudraprayag to Guptkashi. Visit Ardhnareshwar Temple. Overnight.' },
      { day: 3, title: 'Guptkashi to Gaurikund — Begin Trek to Kedarnath', description: 'Drive to Gaurikund (base camp). Begin the 16 km trek to Kedarnath. Arrive by afternoon. Check into dharamshala. Evening aarti at the temple. Overnight at Kedarnath.' },
      { day: 4, title: 'Kedarnath Darshan & Descent', description: 'Wake up early for the magnificent early morning aarti and Abhishek. Darshan of the Jyotirlinga. Trek back down to Gaurikund. Drive to Rudraprayag. Overnight at hotel.' },
      { day: 5, title: 'Return to Delhi via Haridwar', description: 'Drive back to Haridwar. Take a holy dip at Har Ki Pauri. Board the bus back to Delhi. Journey complete.' },
    ],
  },
  {
    slug: 'kedarkantha-trek',
    title: 'Kedarkantha Winter Trek',
    location: 'Kedarkantha',
    state: 'Uttarakhand',
    category: 'adventure',
    duration_days: 6,
    duration_nights: 5,
    group_size_min: 8,
    group_size_max: 12,
    price_per_person: 8500,
    total_price: 102000,
    departure_city: 'Delhi',
    is_featured: false,
    difficulty_level: 'moderate',
    cover_image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    best_time_to_visit: 'December to April',
    description: 'Kedarkantha is India\'s most beloved winter trek for good reason — it offers stunning summit views of 13 major Himalayan peaks, magical snow-covered pine forests, and a relatively accessible trail that makes it perfect for first-time trekkers. The summit at 12,500 ft rewards you with a 360° panorama of peaks including Swargarohini, Bandarpoonch, and Kalanag.',
    highlights: [
      'Summit at 12,500 ft — 360° views of 13 Himalayan peaks',
      'Walk through snow-covered pine forests',
      'Camp at scenic base camp of Kedarkantha',
      'Sankri village — gateway to the trek',
      'Ideal first high-altitude winter trek',
    ],
    inclusions: [
      'Delhi to Sankri by cab (both ways)',
      '5 nights accommodation (2 hotel + 3 camping)',
      'All meals during trek (breakfast + lunch + dinner)',
      'Experienced ITBP-certified mountain guide',
      'Camping equipment (tent, sleeping bag, mattress)',
      'Forest permit charges',
      'Medical kit and oxygen',
    ],
    exclusions: [
      'Personal trekking gear',
      'Personal medications',
      'Tips to guide and cook',
      'Anything not mentioned in inclusions',
    ],
    things_to_carry: [
      'Trek pants and base layers',
      'Heavy down jacket',
      'Trekking shoes with good ankle support',
      'Woolen socks (multiple pairs)',
      'Gloves, muffler, balaclava',
      'Trekking poles (can rent in Sankri)',
      'Water bottle and electrolyte sachets',
      'Sunscreen SPF 50+ and glacier glasses',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Sankri', description: 'Early morning pickup from Delhi. Long drive via Dehradun and Mori. Arrive Sankri by evening. Check into guest house. Team briefing, gear check. Hot dinner. Overnight.' },
      { day: 2, title: 'Sankri to Juda Ka Talab Base Camp', description: 'Trek begins! Walk through Sankri village, terraced fields, and into the oak and rhododendron forest. The trail is wide and gradual. Reach Juda Ka Talab (frozen lake in winter). Set up camp. Bonfire. Dinner under stars at 9,000 ft.' },
      { day: 3, title: 'Juda Ka Talab to Kedarkantha Base', description: 'Higher into the alpine zone. Forests give way to open meadows blanketed in snow. Reach Kedarkantha Base Camp at 11,250 ft. The view of the summit opens up. Camp setup. Acclimatization walk. Stars at altitude — otherworldly.' },
      { day: 4, title: 'Summit Day! — Kedarkantha Peak', description: 'Wake up at 4 AM. Summit push begins at 4:30 AM with headlamps. Steep climb through snow. Reach the summit by 7-8 AM. The 360° panorama hits you — Swargarohini, Bandarpoonch, Black Peak, and more. Descend to Hargaon Camp for night.' },
      { day: 5, title: 'Hargaon to Sankri', description: 'Descend through the forest, different trail from ascent. Arrive Sankri by afternoon. Hot shower and a real bed. Celebration dinner. Exchange photos and stories.' },
      { day: 6, title: 'Sankri to Delhi', description: 'Morning departure from Sankri. Long drive back to Delhi. Arrive by night. Back to civilization with a summit certificate and a changed perspective.' },
    ],
  },
  {
    slug: 'hampta-pass-trek',
    title: 'Hampta Pass Trek',
    location: 'Hampta Pass',
    state: 'Himachal Pradesh',
    category: 'adventure',
    duration_days: 5,
    duration_nights: 4,
    group_size_min: 8,
    group_size_max: 12,
    price_per_person: 9000,
    total_price: 108000,
    departure_city: 'Delhi',
    is_featured: false,
    difficulty_level: 'moderate',
    cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    best_time_to_visit: 'June to October',
    description: 'Hampta Pass is the ultimate landscape-contrast trek in the Himalayas. You start in the lush green Kullu Valley with its apple orchards and waterfalls, trek up through moraines and glaciers, cross the Hampta Pass at 14,100 ft, and descend into the barren, dramatic moonscape of Spiti Valley. All in just 5 days! The contrast is jaw-dropping — this is why trekkers call Hampta Pass the most dramatic day in Himalayan trekking.',
    highlights: [
      'Cross Hampta Pass at 14,100 ft — green to desert in one day',
      'Chandratal Lake — optional extension to the Moon Lake',
      'Camp beside glacial streams in Shea Goru',
      'Dramatic transition from Kullu valley to Spiti\'s lunar landscape',
      'Wildflowers and rhododendron forests on the Kullu side',
    ],
    inclusions: [
      'Delhi to Manali by AC Volvo and return',
      'Manali to trek start by local cab',
      '4 nights camping with good quality tents and sleeping bags',
      'All meals during trek',
      'Certified mountain guide and helper staff',
      'Forest department fees',
      'Basic medical kit',
    ],
    exclusions: [
      'Chandratal extension (optional, extra cost)',
      'Personal trekking gear',
      'Travel insurance',
      'Tips',
    ],
    things_to_carry: [
      'Good quality trekking shoes (waterproof)',
      'Down jacket and thermals',
      'Rain gear or poncho',
      'Trekking poles',
      'Sunscreen SPF 50+ and UV sunglasses',
      'Personal medications and blister kit',
      'Hydration pack or water bottles',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Manali — Overnight Journey', description: 'Board AC Volvo from Delhi at 6 PM. Overnight journey to Manali.' },
      { day: 2, title: 'Manali to Jobra — Trek to Chika', description: 'Arrive Manali morning. Briefing and gear check. Drive to Jobra (trek start). Trek through apple orchards and pine forests to Chika camp (3050m). Set up camp by a glacial stream.' },
      { day: 3, title: 'Chika to Balu Ka Ghera — Into the Mountains', description: 'Trek ascending through lush meadows, crossing several waterfalls. The Kullu Valley reveals itself in all its green glory. Reach Balu Ka Ghera (3800m) — camp at the base of the glacier. Temperature drops sharply. Bonfire and dinner.' },
      { day: 4, title: 'The Big Cross! — Hampta Pass & Descend to Shea Goru', description: 'The most dramatic day. Early start. Trek steeply to Hampta Pass (4270m). At the top — one side is green Kullu, the other is barren Spiti. The contrast is unbelievable. Descend to Shea Goru in Lahaul. Camp by the river.' },
      { day: 5, title: 'Shea Goru to Chatru & Return to Manali', description: 'Trek to Chatru. Drive back to Manali via Rohtang Pass. Arrive Manali. Overnight Volvo to Delhi. Or optional Chandratal Lake extension (extra cost).' },
    ],
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    traveler_city: 'Delhi',
    trip_destination: 'Kasol, Himachal Pradesh',
    review_text: 'Travel Teasing organized the most magical trip of my life! The Kasol group trip was perfectly planned — from the riverside guesthouse to the Kheerganga trek. The group of strangers turned into lifelong friends by day 2. Karan and the team are incredibly responsive on WhatsApp and sorted every small issue instantly. Already booked my next trip to Spiti!',
    rating: 5,
    trip_category: 'group',
    is_active: true,
  },
  {
    name: 'Rahul Verma',
    traveler_city: 'Mumbai',
    trip_destination: 'Ladakh',
    review_text: 'Went for the Ladakh Road Adventure with 9 other strangers — returned with 9 best friends. The Pangong Lake at sunrise literally made me cry. Everything was handled — permits, hotels, guide, flights. Not a single moment of stress. Travel Teasing knows what they\'re doing. 5 stars without hesitation!',
    rating: 5,
    trip_category: 'group',
    is_active: true,
  },
  {
    name: 'Sunita Patel',
    traveler_city: 'Ahmedabad',
    trip_destination: 'Char Dham Yatra',
    review_text: 'We completed Char Dham Yatra as a family of 6, including my 72-year-old mother-in-law. Travel Teasing arranged everything so thoughtfully — pony arrangements at Kedarnath, comfortable hotels, and a guide who knew all the religious significance of each stop. My mother-in-law\'s tears of joy at Kedarnath temple made it all worth it. Pranam to the team!',
    rating: 5,
    trip_category: 'sacred',
    is_active: true,
  },
  {
    name: 'Amit Malhotra',
    traveler_city: 'Pune',
    trip_destination: 'Kedarkantha Trek',
    review_text: 'First trek ever, and what a choice! The Kedarkantha summit view at sunrise is something I will never forget as long as I live. 13 Himalayan peaks all around you, fresh snow under your feet, and your heart pounding with joy. The guides were experienced, patient, and pushed us when we needed it. Highly recommend for first-timers!',
    rating: 5,
    trip_category: 'adventure',
    is_active: true,
  },
  {
    name: 'Meera Krishnan',
    traveler_city: 'Bangalore',
    trip_destination: 'Coorg Family Retreat',
    review_text: 'Took my parents and kids to Coorg with Travel Teasing and it was the perfect family vacation. The plantation resort was stunning — woke up to birds and the smell of coffee every morning. Kids loved the elephant camp. Parents loved the Ayurvedic massage. And the food! The traditional Coorgi meals were outstanding. Thank you for a trip with zero stress!',
    rating: 5,
    trip_category: 'family',
    is_active: true,
  },
  {
    name: 'Deepak Nair',
    traveler_city: 'Hyderabad',
    trip_destination: 'Varanasi Spiritual Journey',
    review_text: 'I have visited Varanasi thrice before but this was my first time with a proper guided tour. The morning boat ride that Travel Teasing arranged — with the exact timing as the sun rose over the ghats — was different from anything I had experienced before. The guide\'s knowledge of each ghat\'s history was incredible. Worth every rupee.',
    rating: 4,
    trip_category: 'sacred',
    is_active: true,
  },
  {
    name: 'Anjali Singh',
    traveler_city: 'Delhi',
    trip_destination: 'Spiti Valley',
    review_text: 'Spiti blew my mind. The Chandrataal Lake drive was nerve-wracking but the view was absolutely worth it. Travel Teasing had arranged a homestay with a local Spitian family in Kaza — that was the highlight. We sat with them, ate local food, and heard stories about life at 13,000 feet. An experience no hotel can give. Absolutely incredible trip organization.',
    rating: 5,
    trip_category: 'group',
    is_active: true,
  },
  {
    name: 'Rajesh Gupta',
    traveler_city: 'Lucknow',
    trip_destination: 'Manali Family Holiday',
    review_text: 'Took my family to Manali for the first time and my kids had the time of their lives in the snow at Solang Valley. The hotel was comfortable and well-located. What impressed me most was how the team handled everything — from snow gear rentals to making sure my elderly father had a comfortable seat in the vehicle. A family trip done right!',
    rating: 5,
    trip_category: 'family',
    is_active: true,
  },
];

const blogs = [
  {
    slug: 'complete-guide-kasol-parvati-valley',
    title: 'Complete Guide to Kasol: Parvati Valley Trek Itinerary',
    excerpt: 'Everything you need to know about visiting Kasol — from the best cafés to the Kheerganga trek, the Manikaran hot springs, and how to plan the perfect Parvati Valley trip.',
    category: 'destination-guide',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-11-15').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    content: `# Complete Guide to Kasol: Your Ultimate Parvati Valley Itinerary

Kasol. Just the name sends a certain kind of traveler reaching for their backpack.

Nestled at an elevation of 1580 meters in the Parvati Valley of Himachal Pradesh, Kasol has earned the nickname "Mini Israel" for the large number of Israeli tourists who discovered its magic decades ago. Today, it's a vibrant hub for backpackers, trekkers, nature lovers, and anyone seeking an escape from India's urban madness.

## Why Kasol?

The Parvati River roars alongside the town, pine forests tower above, and the snow-capped peaks form a constant, humbling backdrop. The cafés blast psytrance and serve shakshuka alongside Maggi noodles. The vibe is entirely unique in India — laid-back, international, and deeply connected to nature.

But Kasol is also a base camp. The real treasures of the Parvati Valley lie beyond:

## Kheerganga Trek — The Crown Jewel

The Kheerganga trek is Kasol's most famous attraction, and for good reason. The 12 km trek (one way) takes you through:

- **Barshaini village** — the drive-head
- **Nakthan village** — with its charming wooden houses and apple trees
- **Rudra Nag waterfall** — a spectacular cascade mid-route
- **The open meadow of Kheerganga** — at 2950 meters

At the top, you find a sacred hot spring where Shiva is believed to have meditated for thousands of years. Soak in the geothermal pool while looking at snow-capped peaks. There are basic dhabas and guest houses if you want to spend the night.

**Difficulty:** Easy to Moderate
**Time:** 5-6 hours ascent, 4 hours descent
**Best season:** May to November

## Manikaran — Faith & Fire

Just 4 km from Kasol, Manikaran is one of the most sacred spots in Himachal Pradesh, holy to both Hindus and Sikhs. The Gurudwara Manikaran Sahib is famous for its geothermal activity — the hot springs here are so powerful that the Gurudwara uses them to cook the langar (community meal) that feeds thousands daily.

Don't miss:
- **Gurudwara langar** — free vegetarian meals served to all
- **Ram Temple** — the ancient 7-story stone temple nearby
- **Hot spring baths** — separate bathing areas for men and women

## The Best Cafés in Kasol

Half the experience of Kasol is sitting in a café by the river, watching the mountains, eating something delicious:

1. **Evergreen** — the OG café, legendary pita and hummus
2. **Chalal Farm** — across the bridge, organic food and river views
3. **Jim Morrison Café** — classic Kasol atmosphere
4. **Moon Dance** — great Israeli breakfast options

## When to Go

**October to May** — ideal weather, cold but clear. Perfect for trekking.
**June to September** — monsoon season. The valley turns impossibly green but the trek to Kheerganga can be risky due to slippery trails and swollen streams.
**December to February** — cold and snow possible. Kheerganga may be closed. Good for the adventurous.

## How to Reach

**Delhi to Kasol (520 km):**
- **Bus:** HRTC buses from ISBT Kashmere Gate to Bhuntar (12-14 hours). From Bhuntar, shared taxis to Kasol (30 minutes, ₹100).
- **Private AC Volvo:** Multiple operators run overnight Volvos from Delhi directly to Bhuntar/Kasol. Departs around 5-6 PM, arrives morning. (~₹700-1200 one way)

**From Bhuntar:** Shared taxis are readily available to Kasol.

## Where to Stay

- **Budget:** Basic river-view guesthouses — ₹500-800/night
- **Mid-range:** Riverside camps and proper guesthouses — ₹1000-2000/night
- **Comfortable:** A handful of proper hotels have opened in recent years — ₹2500+/night

## Packing List for Kasol

- Warm layers (fleece at minimum, down jacket if December onwards)
- Comfortable trekking shoes
- Rain jacket (if visiting May-September)
- Sunscreen
- Cash (ATMs available but limited, can run out on weekends)
- Valid ID (police check-posts en route)

## Travel Teasing Tip

The Kasol group trip organized by Travel Teasing is the best way to experience the valley if you're traveling solo. You get a curated group of like-minded travelers, logistics handled, and the Kheerganga trek with an experienced guide — all at a very reasonable price per person.

The Parvati Valley changes you. Once you've sat by that river as the stars come out, heard the pine trees in the wind, and tasted the clean mountain air — part of you stays in Kasol forever.

*See you in the mountains.*`,
  },
  {
    slug: '10-things-carry-himalayan-trek',
    title: '10 Essential Things to Carry on a Himalayan Trek',
    excerpt: 'Don\'t head into the Himalayas unprepared. Here are the 10 non-negotiable items every trekker must carry, whether you\'re doing Kedarkantha or the Hampta Pass.',
    category: 'travel-tips',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-10-20').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    content: null,
  },
  {
    slug: 'char-dham-yatra-everything-you-need-to-know',
    title: 'Char Dham Yatra: Everything You Need to Know',
    excerpt: 'Planning the sacred Char Dham Yatra? Here\'s a complete guide covering best time to visit, registration process, what to carry, health precautions, and costs for Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    category: 'spiritual',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-09-05').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800',
    content: null,
  },
  {
    slug: 'spiti-valley-in-winter',
    title: 'Spiti Valley in Winter: Is It Worth It?',
    excerpt: 'Winter in Spiti is brutal — roads close, temperatures plummet to -25°C, and power cuts are common. So why do those who go call it the most beautiful experience of their lives? We tell you the truth.',
    category: 'trek-report',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-12-01').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    content: null,
  },
  {
    slug: 'best-offbeat-places-near-delhi-weekend',
    title: 'Best Offbeat Places Near Delhi for a Weekend Trip',
    excerpt: 'Beyond Manali and Shimla — here are 8 truly offbeat destinations within 300 km of Delhi that most people haven\'t heard of yet. Perfect for a quick getaway.',
    category: 'destination-guide',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-11-28').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1585016495481-91613b19e2e8?w=800',
    content: null,
  },
  {
    slug: 'why-traveling-group-better-than-solo',
    title: 'Why Traveling in a Group is Better Than Solo',
    excerpt: 'Solo travel is liberating, yes. But group travel done right offers something solo travel never can — shared wonder, instant friendships, divided costs, and the safety net of a community when things go sideways.',
    category: 'travel-tips',
    author: 'Travel Teasing Team',
    is_published: true,
    published_at: new Date('2024-10-10').toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    content: null,
  },
];

const galleryImages = [
  { image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', caption: 'Parvati Valley, Kasol', location: 'Kasol, Himachal Pradesh', category: 'mountains', sort_order: 1 },
  { image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', caption: 'Spiti Valley — Land of Lamas', location: 'Spiti Valley, Himachal Pradesh', category: 'mountains', sort_order: 2 },
  { image_url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600', caption: 'Pangong Tso at Sunrise', location: 'Ladakh', category: 'lakes', sort_order: 3 },
  { image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600', caption: 'Kedarkantha Summit Views', location: 'Kedarkantha, Uttarakhand', category: 'trekking', sort_order: 4 },
  { image_url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=600', caption: 'Kedarnath Temple', location: 'Kedarnath, Uttarakhand', category: 'sacred', sort_order: 5 },
  { image_url: 'https://images.unsplash.com/photo-1561361058-c24e022cefa6?w=600', caption: 'Ganga Aarti at Varanasi', location: 'Varanasi, Uttar Pradesh', category: 'sacred', sort_order: 6 },
  { image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed68a2c?w=600', caption: 'Jaipur — The Pink City', location: 'Jaipur, Rajasthan', category: 'heritage', sort_order: 7 },
  { image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', caption: 'Snow Play at Solang Valley', location: 'Manali, Himachal Pradesh', category: 'family', sort_order: 8 },
  { image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600', caption: 'Coorg Coffee Plantations', location: 'Coorg, Karnataka', category: 'nature', sort_order: 9 },
  { image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', caption: 'Himalayan Trekking Trails', location: 'Himachal Pradesh', category: 'trekking', sort_order: 10 },
];

const badges = [
  { name: 'First Summit', description: 'Added your first trip to your travel portfolio', icon: '🏔️', condition_type: 'trip_count', condition_value: 1 },
  { name: 'Explorer', description: 'Completed 5 trips', icon: '🌍', condition_type: 'trip_count', condition_value: 5 },
  { name: 'Wanderer', description: 'Completed 10 trips', icon: '🗺️', condition_type: 'trip_count', condition_value: 10 },
  { name: 'Pilgrim', description: 'Completed a sacred journey', icon: '🛕', condition_type: 'trip_type', condition_value: 0 },
  { name: 'Trek Master', description: 'Completed an adventure or trek', icon: '⛺', condition_type: 'trip_type', condition_value: 0 },
  { name: 'Family Traveler', description: 'Completed a family trip', icon: '👨‍👩‍👧', condition_type: 'trip_type', condition_value: 0 },
  { name: 'Group Soul', description: 'Joined or created a group trip', icon: '👥', condition_type: 'group_trip', condition_value: 0 },
  { name: 'Verified Traveler', description: 'Account verified by Travel Teasing', icon: '✅', condition_type: 'verified', condition_value: 0 },
  { name: 'Hill Person', description: 'Visited 3 hill station destinations', icon: '🌄', condition_type: 'hill_count', condition_value: 3 },
  { name: 'State Hopper', description: 'Visited 5 different Indian states', icon: '📍', condition_type: 'state_count', condition_value: 5 },
];

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Seed badges
  console.log('Inserting badges...');
  const { error: badgeError } = await supabaseAdmin.from('badges').upsert(badges, { onConflict: 'name' });
  if (badgeError) console.error('Badge error:', badgeError.message);
  else console.log(`✅ ${badges.length} badges inserted`);

  // Seed packages
  console.log('Inserting packages...');
  for (const pkg of packages) {
    const { error } = await supabaseAdmin.from('packages').upsert(pkg, { onConflict: 'slug' });
    if (error) console.error(`Package error (${pkg.slug}):`, error.message);
    else console.log(`✅ Package: ${pkg.title}`);
  }

  // Seed testimonials
  console.log('\nInserting testimonials...');
  const { error: testError } = await supabaseAdmin.from('testimonials').insert(testimonials);
  if (testError) console.error('Testimonial error:', testError.message);
  else console.log(`✅ ${testimonials.length} testimonials inserted`);

  // Seed blogs
  console.log('\nInserting blogs...');
  for (const blog of blogs) {
    const { error } = await supabaseAdmin.from('blogs').upsert(blog, { onConflict: 'slug' });
    if (error) console.error(`Blog error (${blog.slug}):`, error.message);
    else console.log(`✅ Blog: ${blog.title}`);
  }

  // Seed gallery
  console.log('\nInserting gallery images...');
  const { error: galleryError } = await supabaseAdmin.from('gallery').insert(galleryImages);
  if (galleryError) console.error('Gallery error:', galleryError.message);
  else console.log(`✅ ${galleryImages.length} gallery images inserted`);

  console.log('\n🎉 Seed complete! Your database is now populated with:\n');
  console.log(`  📦 ${packages.length} packages`);
  console.log(`  💬 ${testimonials.length} testimonials`);
  console.log(`  📝 ${blogs.length} blog posts`);
  console.log(`  🖼️  ${galleryImages.length} gallery images`);
  console.log(`  🏅 ${badges.length} badges`);
  console.log('\nRun `npm run dev` to start the application!');

  process.exit(0);
}

seed().catch(console.error);
