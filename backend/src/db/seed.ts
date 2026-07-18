import { db } from './client';
import { categories } from './schema/categories';
import { historicalPeriods } from './schema/historical-periods';
import { dynasties } from './schema/dynasties';
import { locations } from './schema/locations';
import { stories } from './schema/stories';

async function seed() {
  console.log('Nettoyage des tables...');

  await db.delete(stories);
  await db.delete(locations);
  await db.delete(dynasties);
  await db.delete(historicalPeriods);
  await db.delete(categories);

  console.log('Insertion des catégories...');

  const insertedCategories = await db
    .insert(categories)
    .values([
      { nameEn: 'Religious monument', nameFr: 'Monument religieux' },
      { nameEn: 'Palace', nameFr: 'Palais' },
      { nameEn: 'Garden', nameFr: 'Jardin' },
      { nameEn: 'Public square', nameFr: 'Place publique' },
      { nameEn: 'Museum', nameFr: 'Musée' },
      { nameEn: 'Defensive architecture', nameFr: 'Architecture défensive' },
      { nameEn: 'Educational monument', nameFr: 'Monument éducatif' },
      { nameEn: 'Royal necropolis', nameFr: 'Nécropole royale' },
    ])
    .returning();

  console.log(`${insertedCategories.length} catégories insérées`);

  console.log('Insertion des périodes historiques...');

  const insertedPeriods = await db
    .insert(historicalPeriods)
    .values([
      { nameEn: 'Almoravid period', nameFr: 'Période almoravide' },
      { nameEn: 'Almohad period', nameFr: 'Période almohade' },
      { nameEn: 'Marinid period', nameFr: 'Période mérinide' },
      { nameEn: 'Saadi period', nameFr: 'Période saadienne' },
      { nameEn: 'Alaouite period', nameFr: 'Période alaouite' },
      { nameEn: 'Contemporary period', nameFr: 'Période contemporaine' },
    ])
    .returning();

  console.log(`${insertedPeriods.length} périodes insérées`);

  console.log('Insertion des dynasties...');

  const insertedDynasties = await db
    .insert(dynasties)
    .values([
      { nameEn: 'Almoravids', nameFr: 'Almoravides' },
      { nameEn: 'Almohads', nameFr: 'Almohades' },
      { nameEn: 'Marinids', nameFr: 'Mérinides' },
      { nameEn: 'Saadis', nameFr: 'Saadiens' },
      { nameEn: 'Alaouites', nameFr: 'Alaouites' },
    ])
    .returning();

  console.log(`${insertedDynasties.length} dynasties insérées`);

  console.log('Insertion des lieux...');

  const findCategory = (nameEn: string) =>
    insertedCategories.find((c) => c.nameEn === nameEn)!.id;

  const findDynasty = (nameEn: string) =>
    insertedDynasties.find((d) => d.nameEn === nameEn)!.id;

  const insertedLocations = await db
    .insert(locations)
    .values([
      {
        nameEn: 'Koutoubia Mosque',
        nameFr: 'Mosquée Koutoubia',
        descriptionEn: 'The largest mosque in Marrakesh, famous for its 77-metre minaret.',
        descriptionFr: 'La plus grande mosquée de Marrakech, célèbre pour son minaret de 77 mètres.',
        addressEn: 'Avenue Mohammed V, Marrakesh Medina',
        addressFr: 'Avenue Mohammed V, Médina de Marrakech',
        latitude: 31.6238,
        longitude: -7.9935,
        categoryId: findCategory('Religious monument'),
      },
      {
        nameEn: 'Jemaa el-Fna Square',
        nameFr: 'Place Jemaa el-Fna',
        descriptionEn: 'The main square of Marrakesh, listed as UNESCO Intangible Cultural Heritage.',
        descriptionFr: 'La place principale de Marrakech, inscrite au patrimoine culturel immatériel de l\'UNESCO.',
        addressEn: 'Marrakesh Medina',
        addressFr: 'Médina de Marrakech',
        latitude: 31.6258,
        longitude: -7.9891,
        categoryId: findCategory('Public square'),
      },
      {
        nameEn: 'Majorelle Garden',
        nameFr: 'Jardin Majorelle',
        descriptionEn: 'A botanical garden created by Jacques Majorelle, later restored by Yves Saint Laurent.',
        descriptionFr: 'Un jardin botanique créé par Jacques Majorelle, restauré plus tard par Yves Saint Laurent.',
        addressEn: 'Rue Yves Saint Laurent, Marrakesh',
        addressFr: 'Rue Yves Saint Laurent, Marrakech',
        latitude: 31.6417,
        longitude: -8.0028,
        categoryId: findCategory('Garden'),
      },
      {
        nameEn: 'Menara Gardens',
        nameFr: 'Jardin de la Ménara',
        descriptionEn: 'An Almohad-era garden with a large reflecting pool and views of the Atlas Mountains.',
        descriptionFr: 'Un jardin d\'époque almohade avec un grand bassin et une vue sur les montagnes de l\'Atlas.',
        addressEn: 'Avenue de la Ménara, Marrakesh',
        addressFr: 'Avenue de la Ménara, Marrakech',
        latitude: 31.6132,
        longitude: -8.0294,
        categoryId: findCategory('Garden'),
      },
      {
        nameEn: 'Bahia Palace',
        nameFr: 'Palais de la Bahia',
        descriptionEn: 'A late 19th-century palace known for its courtyards and painted ceilings.',
        descriptionFr: 'Un palais de la fin du XIXe siècle connu pour ses cours et ses plafonds peints.',
        addressEn: 'Rue Riad Zitoun el Jdid, Marrakesh Medina',
        addressFr: 'Rue Riad Zitoun el Jdid, Médina de Marrakech',
        latitude: 31.6218,
        longitude: -7.9827,
        categoryId: findCategory('Palace'),
      },
      {
        nameEn: 'El Badi Palace',
        nameFr: 'Palais El Badi',
        descriptionEn: 'A ruined 16th-century palace built to commemorate a victory over the Portuguese.',
        descriptionFr: 'Un palais en ruines du XVIe siècle construit pour commémorer une victoire sur les Portugais.',
        addressEn: 'Ksibat Nhass, Marrakesh Medina',
        addressFr: 'Ksibat Nhass, Médina de Marrakech',
        latitude: 31.618,
        longitude: -7.9838,
        categoryId: findCategory('Palace'),
      },
      {
        nameEn: 'Saadian Tombs',
        nameFr: 'Tombeaux Saadiens',
        descriptionEn: 'A royal necropolis from the Saadi dynasty, rediscovered in 1917.',
        descriptionFr: 'Une nécropole royale de la dynastie saadienne, redécouverte en 1917.',
        addressEn: 'Rue de la Kasbah, Marrakesh Medina',
        addressFr: 'Rue de la Kasbah, Médina de Marrakech',
        latitude: 31.6169,
        longitude: -7.9838,
        categoryId: findCategory('Royal necropolis'),
      },
      {
        nameEn: 'Ben Youssef Madrasa',
        nameFr: 'Medersa Ben Youssef',
        descriptionEn: 'The largest Islamic school in Morocco, founded in the 14th century.',
        descriptionFr: 'La plus grande école coranique du Maroc, fondée au XIVe siècle.',
        addressEn: 'Place Ben Youssef, Marrakesh Medina',
        addressFr: 'Place Ben Youssef, Médina de Marrakech',
        latitude: 31.6314,
        longitude: -7.9838,
        categoryId: findCategory('Educational monument'),
      },
      {
        nameEn: 'Walls of Marrakesh',
        nameFr: 'Remparts de Marrakech',
        descriptionEn: 'Nearly 19 km of red ramparts built by the Almoravids to defend the city.',
        descriptionFr: 'Près de 19 km de remparts rouges construits par les Almoravides pour défendre la ville.',
        addressEn: 'Bab Agnaou, Marrakesh Medina',
        addressFr: 'Bab Agnaou, Médina de Marrakech',
        latitude: 31.6167,
        longitude: -7.9847,
        categoryId: findCategory('Defensive architecture'),
      },
      {
        nameEn: 'Marrakesh Museum',
        nameFr: 'Musée de Marrakech',
        descriptionEn: 'A late 19th-century palace turned museum, housing ceramics and traditional art.',
        descriptionFr: 'Un palais de la fin du XIXe siècle transformé en musée, abritant céramiques et art traditionnel.',
        addressEn: 'Place Ben Youssef, Marrakesh Medina',
        addressFr: 'Place Ben Youssef, Médina de Marrakech',
        latitude: 31.6308,
        longitude: -7.9847,
        categoryId: findCategory('Museum'),
      },
    ])
    .returning();

  console.log(`${insertedLocations.length} lieux insérés`);


  console.log('Insertion des histoires...');

  const findLocation = (nameEn: string) =>
    insertedLocations.find((l) => l.nameEn === nameEn)!.id;

  const findPeriod = (nameEn: string) =>
    insertedPeriods.find((p) => p.nameEn === nameEn)!.id;

  const insertedStories = await db
    .insert(stories)
    .values([
      {
        titleEn: 'The Koutoubia Mosque, symbol of Marrakesh',
        titleFr: 'La mosquée Koutoubia, symbole de Marrakech',
        shortDescriptionEn: 'The largest mosque in Marrakesh, its 77-metre minaret has watched over the city since the 12th century.',
        shortDescriptionFr: 'La plus grande mosquée de Marrakech, son minaret de 77 mètres veille sur la ville depuis le XIIe siècle.',
        fullStoryEn: `# The Koutoubia Mosque

The Koutoubia Mosque is the largest mosque in Marrakesh and one of the most recognisable landmarks of the city. Its construction began under the Almohad dynasty, with the current building largely completed around 1158, replacing an earlier version that had been misaligned toward Mecca.

![The Koutoubia minaret rising above Marrakesh](https://upload.wikimedia.org/wikipedia/commons/1/14/Mosqu%C3%A9e_de_la_Koutoubia_-_marakesh.jpg)

The mosque takes its name from the Arabic word for booksellers, as manuscript and book sellers once gathered around it. Its minaret, roughly 77 metres tall including its spire, became the architectural model for other famous towers, including the Giralda in Seville.

Non-Muslim visitors cannot enter the mosque itself, but the surrounding gardens and the silhouette of the minaret remain one of the most photographed views in Marrakesh.`,
        fullStoryFr: `# La mosquée Koutoubia

La mosquée Koutoubia est la plus grande mosquée de Marrakech et l'un des monuments les plus reconnaissables de la ville. Sa construction a débuté sous la dynastie almohade, le bâtiment actuel étant achevé vers 1158, remplaçant une version antérieure mal orientée vers La Mecque.

![Le minaret de la Koutoubia s'élevant au-dessus de Marrakech](https://upload.wikimedia.org/wikipedia/commons/1/14/Mosqu%C3%A9e_de_la_Koutoubia_-_marakesh.jpg)

La mosquée tire son nom du mot arabe désignant les libraires, car des vendeurs de manuscrits et de livres se rassemblaient autrefois autour d'elle. Son minaret, haut d'environ 77 mètres avec sa flèche, a servi de modèle architectural à d'autres tours célèbres, dont la Giralda de Séville.

Les visiteurs non musulmans ne peuvent pas entrer dans la mosquée elle-même, mais les jardins environnants et la silhouette du minaret restent l'une des vues les plus photographiées de Marrakech.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Mosqu%C3%A9e_de_la_Koutoubia_-_marakesh.jpg',
        century: 12,
        categoryId: findCategory('Religious monument'),
        locationId: findLocation('Koutoubia Mosque'),
        historicalPeriodId: findPeriod('Almohad period'),
        dynastyId: findDynasty('Almohads'),
        isPublished: true,
      },
      {
        titleEn: 'Jemaa el-Fna, the beating heart of Marrakesh',
        titleFr: 'Jemaa el-Fna, le cœur battant de Marrakech',
        shortDescriptionEn: 'A UNESCO-listed square that has served as the city\'s marketplace and stage for storytellers for centuries.',
        shortDescriptionFr: 'Une place classée UNESCO qui sert de marché et de scène aux conteurs de la ville depuis des siècles.',
        fullStoryEn: `# Jemaa el-Fna Square

Jemaa el-Fna is the main square of Marrakesh's medina and one of the busiest in Africa. Its name is often translated as "the assembly of the dead" or "the mosque at the end of the world," referring to a mosque that once stood on the site.

![Jemaa el-Fna square filled with stalls at dusk](https://upload.wikimedia.org/wikipedia/commons/1/1c/Place_Jemaa_el-Fna_-_Marrakech_-_Morocco_-_Maroc_-_Maroko_-_%CE%9C%CE%B1%CF%81%CF%8C%CE%BA%CE%BF_-_Fas_-_Marruecos_-_Marokko_-_%D0%9C%D0%B0%D1%80%D0%BE%D0%BA%D0%BA%D0%BE_-_Night_-_Nuit_-_Photo_Image_Photography_%289126147462%29.jpg)

By day, the square hosts orange juice stalls, snake charmers, and henna artists. By night, it transforms into an open-air theatre of food stalls, musicians, and storytellers continuing a tradition that stretches back centuries. In 2001, UNESCO recognised the square's oral traditions as a Masterpiece of the Oral and Intangible Heritage of Humanity.`,
        fullStoryFr: `# La place Jemaa el-Fna

Jemaa el-Fna est la place principale de la médina de Marrakech et l'une des plus animées d'Afrique. Son nom est souvent traduit par "l'assemblée des morts" ou "la mosquée à la fin du monde", en référence à une mosquée qui se trouvait autrefois à cet endroit.

![La place Jemaa el-Fna remplie d'étals au crépuscule](https://upload.wikimedia.org/wikipedia/commons/1/1c/Place_Jemaa_el-Fna_-_Marrakech_-_Morocco_-_Maroc_-_Maroko_-_%CE%9C%CE%B1%CF%81%CF%8C%CE%BA%CE%BF_-_Fas_-_Marruecos_-_Marokko_-_%D0%9C%D0%B0%D1%80%D0%BE%D0%BA%D0%BA%D0%BE_-_Night_-_Nuit_-_Photo_Image_Photography_%289126147462%29.jpg)

Le jour, la place accueille des étals de jus d'orange, des charmeurs de serpents et des artistes du henné. La nuit, elle se transforme en un théâtre à ciel ouvert avec des stands de nourriture, des musiciens et des conteurs perpétuant une tradition vieille de plusieurs siècles. En 2001, l'UNESCO a reconnu les traditions orales de la place comme chef-d'œuvre du patrimoine oral et immatériel de l'humanité.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Place_Jemaa_el-Fna_-_Marrakech_-_Morocco_-_Maroc_-_Maroko_-_%CE%9C%CE%B1%CF%81%CF%8C%CE%BA%CE%BF_-_Fas_-_Marruecos_-_Marokko_-_%D0%9C%D0%B0%D1%80%D0%BE%D0%BA%D0%BA%D0%BE_-_Night_-_Nuit_-_Photo_Image_Photography_%289126147462%29.jpg',
        century: 11,
        categoryId: findCategory('Public square'),
        locationId: findLocation('Jemaa el-Fna Square'),
        historicalPeriodId: findPeriod('Almoravid period'),
        dynastyId: findDynasty('Almoravids'),
        isPublished: true,
      },
      {
        titleEn: 'Majorelle Garden, a splash of cobalt blue',
        titleFr: 'Le Jardin Majorelle, une touche de bleu cobalt',
        shortDescriptionEn: 'A botanical garden created by a French painter and later restored by Yves Saint Laurent.',
        shortDescriptionFr: 'Un jardin botanique créé par un peintre français, plus tard restauré par Yves Saint Laurent.',
        fullStoryEn: `# Majorelle Garden

Majorelle Garden was created between the 1920s and 1930s by French painter Jacques Majorelle, who settled in Marrakesh and spent decades developing this botanical garden around his villa.

![The vivid blue walls of Majorelle Garden](https://upload.wikimedia.org/wikipedia/commons/5/57/Le_jardin_des_majorelle_16.JPG)

The garden is famous for the vivid cobalt blue used throughout its structures, a shade now known as "Majorelle Blue." After Majorelle's death, the garden fell into disrepair until it was purchased and restored in the 1980s by fashion designer Yves Saint Laurent and his partner Pierre Bergé, who are commemorated there today.`,
        fullStoryFr: `# Le Jardin Majorelle

Le Jardin Majorelle a été créé entre les années 1920 et 1930 par le peintre français Jacques Majorelle, qui s'installa à Marrakech et passa des décennies à développer ce jardin botanique autour de sa villa.

![Les murs bleu vif du Jardin Majorelle](https://upload.wikimedia.org/wikipedia/commons/5/57/Le_jardin_des_majorelle_16.JPG)

Le jardin est célèbre pour le bleu cobalt vif utilisé dans toutes ses structures, une teinte aujourd'hui connue sous le nom de "bleu Majorelle". Après la mort de Majorelle, le jardin tomba en désuétude jusqu'à son rachat et sa restauration dans les années 1980 par le couturier Yves Saint Laurent et son compagnon Pierre Bergé, tous deux honorés sur les lieux aujourd'hui.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Le_jardin_des_majorelle_16.JPG',
        century: 20,
        categoryId: findCategory('Garden'),
        locationId: findLocation('Majorelle Garden'),
        historicalPeriodId: findPeriod('Contemporary period'),
        dynastyId: null,
        isPublished: true,
      },
      {
        titleEn: 'The Menara Gardens, an Almohad oasis',
        titleFr: 'Le Jardin de la Ménara, une oasis almohade',
        shortDescriptionEn: 'A vast orchard and reflecting pool built in the 12th century at the foot of the Atlas Mountains.',
        shortDescriptionFr: 'Un vaste verger et un bassin construits au XIIe siècle au pied des montagnes de l\'Atlas.',
        fullStoryEn: `# The Menara Gardens

The Menara Gardens were laid out in the 12th century under the Almohad dynasty, primarily as an olive grove irrigated by a large artificial pool.

![The Menara pavilion reflected in its pool with the Atlas Mountains behind](https://upload.wikimedia.org/wikipedia/commons/c/c4/Jardins_de_la_M%C3%A9nara.jpg)

The pavilion overlooking the pool was added centuries later, and the whole site became a popular retreat for Marrakshis, especially at sunset when the Atlas Mountains are visible in the distance. The irrigation system feeding the pool remains an example of historic Almohad hydraulic engineering.`,
        fullStoryFr: `# Le Jardin de la Ménara

Le Jardin de la Ménara fut aménagé au XIIe siècle sous la dynastie almohade, principalement comme oliveraie irriguée par un grand bassin artificiel.

![Le pavillon de la Ménara se reflétant dans son bassin avec les montagnes de l'Atlas en arrière-plan](https://upload.wikimedia.org/wikipedia/commons/c/c4/Jardins_de_la_M%C3%A9nara.jpg)

Le pavillon surplombant le bassin fut ajouté des siècles plus tard, et le site tout entier devint un lieu de promenade prisé des Marrakchis, notamment au coucher du soleil lorsque les montagnes de l'Atlas sont visibles au loin. Le système d'irrigation alimentant le bassin demeure un exemple de l'ingénierie hydraulique almohade historique.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Jardins_de_la_M%C3%A9nara.jpg',
        century: 12,
        categoryId: findCategory('Garden'),
        locationId: findLocation('Menara Gardens'),
        historicalPeriodId: findPeriod('Almohad period'),
        dynastyId: findDynasty('Almohads'),
        isPublished: true,
      },
      {
        titleEn: 'Bahia Palace, a masterpiece of the 19th century',
        titleFr: 'Le Palais de la Bahia, un chef-d\'œuvre du XIXe siècle',
        shortDescriptionEn: 'Built to be the greatest palace of its time, adorned with painted ceilings and lush courtyards.',
        shortDescriptionFr: 'Construit pour être le plus grand palais de son époque, orné de plafonds peints et de cours luxuriantes.',
        fullStoryEn: `# Bahia Palace

Bahia Palace, meaning "brilliance," was built in the late 19th century by Si Moussa, grand vizier to Sultan Hassan I, and later expanded by his son Bou Ahmed.

![A painted ceiling inside Bahia Palace](https://upload.wikimedia.org/wikipedia/commons/f/fc/Bahia_Palace_large_court.jpg)

Intended to be the greatest palace of its era, Bahia Palace spans roughly 8,000 square metres and combines Islamic and Moroccan architectural styles. Its rooms open onto courtyards filled with orange trees, and its ceilings are richly decorated with painted cedar wood, reflecting the wealth and status of its original occupants.`,
        fullStoryFr: `# Le Palais de la Bahia

Le Palais de la Bahia, dont le nom signifie "la brillance," fut construit à la fin du XIXe siècle par Si Moussa, grand vizir du sultan Hassan Ier, puis agrandi par son fils Bou Ahmed.

![Un plafond peint à l'intérieur du Palais de la Bahia](https://upload.wikimedia.org/wikipedia/commons/f/fc/Bahia_Palace_large_court.jpg)

Conçu pour être le plus grand palais de son époque, le Palais de la Bahia s'étend sur environ 8 000 mètres carrés et associe les styles architecturaux islamique et marocain. Ses pièces s'ouvrent sur des cours plantées d'orangers, et ses plafonds sont richement décorés de bois de cèdre peint, reflétant la richesse et le statut de ses occupants d'origine.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Bahia_Palace_large_court.jpg',
        century: 19,
        categoryId: findCategory('Palace'),
        locationId: findLocation('Bahia Palace'),
        historicalPeriodId: findPeriod('Alaouite period'),
        dynastyId: findDynasty('Alaouites'),
        isPublished: true,
      },
      {
        titleEn: 'El Badi Palace, the incomparable ruin',
        titleFr: 'Le Palais El Badi, la ruine incomparable',
        shortDescriptionEn: 'Once a lavish 16th-century palace, now a majestic ruin home to nesting storks.',
        shortDescriptionFr: 'Autrefois un fastueux palais du XVIe siècle, aujourd\'hui une ruine majestueuse abritant des cigognes.',
        fullStoryEn: `# El Badi Palace

El Badi Palace, meaning "the incomparable," was built at the end of the 16th century by Saadi sultan Ahmad al-Mansur, largely to celebrate a decisive victory over Portuguese forces.

![The ruined courtyard of El Badi Palace with storks nesting on its walls](https://upload.wikimedia.org/wikipedia/commons/4/4d/El_Badi_Palace%2C_Marrakesh%2C_Morocco%2C_20250125_1002_7127.jpg)

The palace once featured an immense courtyard with a central pool, four pavilions, and hundreds of rooms used for state ceremonies. In the early 18th century, Sultan Moulay Ismail stripped the palace of its precious materials to decorate his new capital in Meknes, leaving the imposing ruins visible today, now a UNESCO World Heritage site and a nesting ground for storks.`,
        fullStoryFr: `# Le Palais El Badi

Le Palais El Badi, dont le nom signifie "l'incomparable," fut construit à la fin du XVIe siècle par le sultan saadien Ahmed al-Mansour, en grande partie pour célébrer une victoire décisive sur les forces portugaises.

![La cour en ruines du Palais El Badi avec des cigognes nichant sur ses murs](https://upload.wikimedia.org/wikipedia/commons/4/4d/El_Badi_Palace%2C_Marrakesh%2C_Morocco%2C_20250125_1002_7127.jpg)

Le palais possédait autrefois une immense cour avec un bassin central, quatre pavillons et des centaines de pièces destinées aux cérémonies officielles. Au début du XVIIIe siècle, le sultan Moulay Ismaïl fit dépouiller le palais de ses matériaux précieux pour décorer sa nouvelle capitale à Meknès, laissant les ruines imposantes visibles aujourd'hui, désormais classées au patrimoine mondial de l'UNESCO et lieu de nidification des cigognes.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/El_Badi_Palace%2C_Marrakesh%2C_Morocco%2C_20250125_1002_7127.jpg',
        century: 16,
        categoryId: findCategory('Palace'),
        locationId: findLocation('El Badi Palace'),
        historicalPeriodId: findPeriod('Saadi period'),
        dynastyId: findDynasty('Saadis'),
        isPublished: true,
      },
      {
        titleEn: 'The Saadian Tombs, a hidden necropolis',
        titleFr: 'Les Tombeaux Saadiens, une nécropole cachée',
        shortDescriptionEn: 'A royal burial site sealed for centuries and rediscovered only in 1917.',
        shortDescriptionFr: 'Un lieu de sépulture royal scellé pendant des siècles et redécouvert seulement en 1917.',
        fullStoryEn: `# The Saadian Tombs

The Saadian Tombs date to the reign of Saadi sultan Ahmad al-Mansur in the late 16th century and served as the royal necropolis of the Saadi dynasty.

![Intricately decorated marble tombs inside the Saadian mausoleum](https://upload.wikimedia.org/wikipedia/commons/3/3b/Saadian_Tombs_1044-HDR.jpg)

When Sultan Moulay Ismail destroyed most traces of the Saadi dynasty in the early 18th century, he chose not to profane the tombs, instead sealing off the entrance to the cemetery. The site remained hidden for over two centuries until it was rediscovered in 1917 and opened to the public, revealing finely carved marble and cedar decoration.`,
        fullStoryFr: `# Les Tombeaux Saadiens

Les Tombeaux Saadiens datent du règne du sultan saadien Ahmed al-Mansour à la fin du XVIe siècle et servaient de nécropole royale à la dynastie saadienne.

![Des tombes en marbre finement décorées à l'intérieur du mausolée saadien](https://upload.wikimedia.org/wikipedia/commons/3/3b/Saadian_Tombs_1044-HDR.jpg)

Lorsque le sultan Moulay Ismaïl détruisit la plupart des vestiges de la dynastie saadienne au début du XVIIIe siècle, il choisit de ne pas profaner les tombeaux, préférant murer l'entrée du cimetière. Le site resta caché pendant plus de deux siècles jusqu'à sa redécouverte en 1917 et son ouverture au public, révélant un marbre et un bois de cèdre finement sculptés.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Saadian_Tombs_1044-HDR.jpg',
        century: 16,
        categoryId: findCategory('Royal necropolis'),
        locationId: findLocation('Saadian Tombs'),
        historicalPeriodId: findPeriod('Saadi period'),
        dynastyId: findDynasty('Saadis'),
        isPublished: true,
      },
      {
        titleEn: 'Ben Youssef Madrasa, a jewel of Islamic architecture',
        titleFr: 'La Medersa Ben Youssef, un joyau de l\'architecture islamique',
        shortDescriptionEn: 'The largest Quranic school in Morocco, once home to hundreds of students.',
        shortDescriptionFr: 'La plus grande école coranique du Maroc, qui a autrefois accueilli des centaines d\'étudiants.',
        fullStoryEn: `# Ben Youssef Madrasa

Ben Youssef Madrasa was founded in the 14th century by Marinid sultan Abu al-Hasan and later rebuilt and expanded by the Saadi dynasty in the 16th century, becoming the largest Islamic college in the Maghreb.

![The central courtyard of Ben Youssef Madrasa with its carved stucco and zellige tilework](https://upload.wikimedia.org/wikipedia/commons/3/3f/Madraza_Ben_Youssef_06.JPG)

At its peak, the madrasa could house up to 900 students of law and theology around a richly decorated central courtyard, featuring carved cedar wood, stucco, and zellige tilework. The building was converted into a museum in 1960 and remains one of the most admired examples of Moroccan Islamic architecture.`,
        fullStoryFr: `# La Medersa Ben Youssef

La Medersa Ben Youssef fut fondée au XIVe siècle par le sultan mérinide Abu al-Hassan, puis reconstruite et agrandie par la dynastie saadienne au XVIe siècle, devenant ainsi le plus grand collège islamique du Maghreb.

![La cour centrale de la Medersa Ben Youssef avec ses stucs sculptés et ses zelliges](https://upload.wikimedia.org/wikipedia/commons/3/3f/Madraza_Ben_Youssef_06.JPG)

À son apogée, la medersa pouvait accueillir jusqu'à 900 étudiants en droit et théologie autour d'une cour centrale richement décorée, ornée de bois de cèdre sculpté, de stuc et de zelliges. Le bâtiment fut transformé en musée en 1960 et demeure l'un des exemples les plus admirés de l'architecture islamique marocaine.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Madraza_Ben_Youssef_06.JPG',
        century: 14,
        categoryId: findCategory('Educational monument'),
        locationId: findLocation('Ben Youssef Madrasa'),
        historicalPeriodId: findPeriod('Marinid period'),
        dynastyId: findDynasty('Marinids'),
        isPublished: true,
      },
      {
        titleEn: 'The Walls of Marrakesh, red ramparts of the city',
        titleFr: 'Les Remparts de Marrakech, murailles rouges de la cité',
        shortDescriptionEn: 'Nearly 19 kilometres of red ramparts built to defend the city in the 12th century.',
        shortDescriptionFr: 'Près de 19 kilomètres de remparts rouges construits pour défendre la ville au XIIe siècle.',
        fullStoryEn: `# The Walls of Marrakesh

The Walls of Marrakesh were built by the Almoravid dynasty in the 12th century, under sultan Ali ibn Yusuf, to protect the growing city from Almohad threats.

![A monumental gate in the red ramparts of Marrakesh](https://upload.wikimedia.org/wikipedia/commons/1/1f/Along_the_walls_of_Marrakesh_%2849906171493%29.jpg)

Stretching nearly 19 kilometres and reaching up to eight metres in height in places, the ramparts are built from rammed earth mixed with lime, giving them their distinctive reddish-pink colour. Several monumental gates, including Bab Agnaou, punctuate the walls and remain iconic entry points into the old medina.`,
        fullStoryFr: `# Les Remparts de Marrakech

Les Remparts de Marrakech furent construits par la dynastie almoravide au XIIe siècle, sous le règne du sultan Ali ibn Youssef, afin de protéger la ville en pleine expansion des menaces almohades.

![Une porte monumentale dans les remparts rouges de Marrakech](https://upload.wikimedia.org/wikipedia/commons/1/1f/Along_the_walls_of_Marrakesh_%2849906171493%29.jpg)

S'étendant sur près de 19 kilomètres et atteignant par endroits huit mètres de hauteur, les remparts sont construits en pisé mélangé à de la chaux, ce qui leur donne leur couleur rose-rouge caractéristique. Plusieurs portes monumentales, dont Bab Agnaou, ponctuent les murailles et demeurent des points d'entrée emblématiques de l'ancienne médina.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Along_the_walls_of_Marrakesh_%2849906171493%29.jpg',
        century: 12,
        categoryId: findCategory('Defensive architecture'),
        locationId: findLocation('Walls of Marrakesh'),
        historicalPeriodId: findPeriod('Almoravid period'),
        dynastyId: findDynasty('Almoravids'),
        isPublished: true,
      },
      {
        titleEn: 'The Marrakesh Museum, a palace of art',
        titleFr: 'Le Musée de Marrakech, un palais dédié à l\'art',
        shortDescriptionEn: 'A 19th-century palace turned museum, showcasing Moroccan ceramics and traditional crafts.',
        shortDescriptionFr: 'Un palais du XIXe siècle transformé en musée, présentant céramiques marocaines et artisanat traditionnel.',
        fullStoryEn: `# The Marrakesh Museum

The Marrakesh Museum is housed in Dar Menebhi, a palace built at the end of the 19th century for a prominent government minister of the Alaouite era.

![The central hall of the Marrakesh Museum with its ornate chandelier](https://upload.wikimedia.org/wikipedia/commons/4/4c/Marrakesh_Museum_%285364716707%29.jpg)

The palace's traditional architecture, featuring a central courtyard, fountains, and finely carved stucco, now serves as a backdrop for exhibitions of Moroccan ceramics, jewellery, carpets, and contemporary art. It remains one of the medina's most elegant examples of restored residential architecture.`,
        fullStoryFr: `# Le Musée de Marrakech

Le Musée de Marrakech est installé dans Dar Menebhi, un palais construit à la fin du XIXe siècle pour un ministre influent de l'époque alaouite.

![La salle centrale du Musée de Marrakech avec son lustre orné](https://upload.wikimedia.org/wikipedia/commons/4/4c/Marrakesh_Museum_%285364716707%29.jpg)

L'architecture traditionnelle du palais, avec sa cour centrale, ses fontaines et ses stucs finement sculptés, sert aujourd'hui de cadre à des expositions de céramiques marocaines, de bijoux, de tapis et d'art contemporain. Il demeure l'un des exemples les plus élégants d'architecture résidentielle restaurée de la médina.`,
        coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Marrakesh_Museum_%285364716707%29.jpg',
        century: 19,
        categoryId: findCategory('Museum'),
        locationId: findLocation('Marrakesh Museum'),
        historicalPeriodId: findPeriod('Alaouite period'),
        dynastyId: findDynasty('Alaouites'),
        isPublished: true,
      },
    ])
    .returning();

  console.log(`${insertedStories.length} histoires insérées`);

  console.log('Seed terminé avec succès.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erreur pendant le seed :', err);
  process.exit(1);
});