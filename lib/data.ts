// lib/data.ts

// Data for Quiz Questions
export const traitsQ1 = ["Confident", "Curious", "Determined", "Imaginative", "Poised", "Compassionate", "Enthusiastic", "Bold", "Innovative"];
export const traitsQ4 = ["Influential", "Adventurous", "Tough", "Expressive", "Polished", "Selfless", "Playful", "Independent", "Analytical"];
export const imageFiles = ["OrangeSet.jpg", "BrownSet.jpg", "RedSet.jpg", "YellowSet.jpg", "PurpleSet.jpg", "BlueSet.jpg", "GreenSet.jpg", "PinkSet.jpg", "BlackSet.jpg"];
export const modesOfConnection = ["Achieve With Me", "Explore With Me", "Strive With Me", "Create With Me", "Refine With Me", "Care With Me", "Enjoy With Me", "Defy With Me", "Invent With Me"];
export const affiliations = ["Admitted Student", "Current Student", "Faculty/Staff", "Alum"];
export const collegeLocations = ["In-state", "Out-of-state", "No preference"];
export const collegeTypes = ["Public", "Private", "Denominational", "No Preference"];
export const collegeSizes = ["2,500 or less", "2,501-7,500", "7,501+"];
export const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];


// Mappings for Scoring Logic
export const traitScoreMap: { [key: string]: string } = {
  "Confident": "Blue", "Curious": "Green", "Determined": "Maroon", "Imaginative": "Orange", "Poised": "Pink",
  "Compassionate": "Purple", "Enthusiastic": "Red", "Bold": "Silver", "Innovative": "Yellow", "Influential": "Blue",
  "Adventurous": "Green", "Tough": "Maroon", "Expressive": "Orange", "Polished": "Pink", "Selfless": "Purple",
  "Playful": "Red", "Independent": "Silver", "Analytical": "Yellow", "Achieve With Me": "Blue", "Explore With Me": "Green",
  "Strive With Me": "Maroon", "Create With Me": "Orange", "Refine With Me": "Pink", "Care With Me": "Purple",
  "Enjoy With Me": "Red", "Defy With Me": "Silver", "Invent With Me": "Yellow"
};

export const imageScoreMap: { [key: string]: string } = {
  "OrangeSet.jpg": "Orange", "BrownSet.jpg": "Maroon", "RedSet.jpg": "Red", "YellowSet.jpg": "Yellow",
  "PurpleSet.jpg": "Purple", "BlueSet.jpg": "Blue", "GreenSet.jpg": "Green", "PinkSet.jpg": "Pink", "BlackSet.jpg": "Silver"
};

// Motivator Categories
export const motivatorCategories = {
  "Strength Motivator": ["Silver", "Blue", "Maroon"],
  "Vitality Motivator": ["Pink", "Purple", "Red"],
  "Creativity Motivator": ["Green", "Orange", "Yellow"],
};

// Persona Name and Description Mapping
// Using a "Primary-Secondary" key format for easy lookup.
export const personaMap: { [key: string]: { name: string, description: string } } = {
    "Blue-Maroon": { name: "Champion", description: "Champions are driven by growth, being frontrunners, and overcoming challenges. They are the first to battle on behalf of the needs, rights, and honor of others..." },
    "Blue-Green": { name: "Captain", description: "Captains are driven by growth, being frontrunners, and by a quest for the unknown. They wield immense influence along each step of a journey..." },
    "Blue-Orange": { name: "Director", description: "Directors are driven by growth, being frontrunners, and by self-expression and artistry. They are both boldly self-assured and ambiguous when translating their creative vision..." },
    "Blue-Pink": { name: "Producer", description: "Producers are driven by growth, being frontrunners, and by experience, elegance, and beauty in all its forms. They bring forth timeless ideas and concepts..." },
    "Blue-Purple": { name: "Mentor", description: "Mentors are driven by growth, being frontrunners, and by a need to compassionately care for others. They are known for their capacity as wise and trusted guides..." },
    "Blue-Red": { name: "Coach", description: "Coaches are driven by growth and being frontrunners, and a desire to excite others. With boundless reserves of enthusiasm, they train and push others..." },
    "Blue-Silver": { name: "Maverick", description: "Mavericks are driven by growth, being frontrunners, and by a desire to challenge the establishment. They are independent thinkers who seek to set their own agenda..." },
    "Blue-Yellow": { name: "Visionary", description: "Visionaries are driven by growth, being frontrunners, and by a need to innovate. They possess foresight, imagination, and the ambition to bring their insights to life..." },
    "Blue-Beige": { name: "Achiever", description: "Blue Achievers can be found at the front of any effort heading toward victory. While most might buckle under the pressure to succeed..." },
    "Maroon-Blue": { name: "Contender", description: "Contenders are driven to overcome challenges and by growth and being frontrunners. They demonstrate natural ability and grit, persist in the face of difficulties..." },
    "Maroon-Green": { name: "Pioneer", description: "Pioneers are driven to overcome challenges and by the quest for the unknown. They are comfortable embarking into wild and uncharted regions..." },
    "Maroon-Orange": { name: "Maker", description: "Makers are driven to overcome challenges and by self-expression and artistry. They are hands-on in their ideas, taking what is abstract and creating something tangible..." },
    "Maroon-Pink": { name: "Precisionist", description: "Precisionists are driven to overcome challenges and by experience, elegance, and beauty in all forms. They are uncompromising and disciplined..." },
    "Maroon-Purple": { name: "Protector", description: "Protectors are driven to overcome challenges and by a compassionate need to care for others. They are staunch advocates of justice..." },
    "Maroon-Red": { name: "Energizer", description: "Energizers are driven to overcome challenges and by a desire to entertain and cause others to get excited. Their endless resolve and abundant enthusiasm..." },
    "Maroon-Silver": { name: "Dark Horse", description: "Dark Horses are driven to overcome challenges and by a desire to disrupt the norm and challenge the establishment. They have a healthy disdain for age-old cultural systems..." },
    "Maroon-Yellow": { name: "Challenger", description: "Challengers are driven to overcome obstacles and by a need to invent the future through innovation. They boldly and defiantly reframe potential hurdles..." },
    "Maroon-Beige": { name: "Competitor", description: "Maroon Competitors are the consummate engines that work hard and persevere to achieve. Defined by their intense determination, resilience against obstacles..." },
    "Green-Blue": { name: "Trailblazer", description: "Trailblazers are driven by the quest for the unknown and by growth and being frontrunners. They are explorers at heart as they courageously break new ground..." },
    "Green-Maroon": { name: "Adventurer", description: "Adventurers are driven by the quest for the unknown and by a need to overcome challenges. They feel a rush and exhilaration amid new opportunities and encounters..." },
    "Green-Orange": { name: "Seeker", description: "Seekers are driven by the quest for the unknown and by self-expression through artistry. They chase after wisdom, answers, and truth..." },
    "Green-Pink": { name: "Detective", description: "Detectives are driven by the quest for the unknown and by experience, elegance, and beauty in all forms. Natural investigators, they subject themselves..." },
    "Green-Purple": { name: "Ambassador", description: "Ambassadors are driven by the quest for the unknown and by a need to compassionately care for others. People entrust their personal stories and information..." },
    "Green-Red": { name: "Globetrotter", description: "Globetrotters are driven by the quest for the unknown and a desire to cause others to get excited. They consider the world and its people a treasure trove..." },
    "Green-Silver": { name: "Ranger", description: "Rangers are driven by the quest for the unknown and by a desire to challenge the establishment. They are not afraid of controversy..." },
    "Green-Yellow": { name: "Researcher", description: "Researchers are driven by the quest for the unknown and by a need to invent the future through innovation. They are devoted to the scholarly practices of inquiry..." },
    "Green-Beige": { name: "Explorer", description: "Green Explorers are spirited adventurers who are constantly exploring and questioning the world around them. Their insatiable curiosity dives deep..." },
    "Orange-Blue": { name: "Architect", description: "Architects are driven by self-expression and artistry and by growth and being frontrunners. Their intelligent foresight and carefully contrived plans..." },
    "Orange-Maroon": { name: "Artisan", description: "Artisans are driven by self-expression and a need to overcome challenges. They are devoted to their trade or craft and delight in bringing a plan or concept to life..." },
    "Orange-Green": { name: "Searcher", description: "Searchers are driven by self-expression and artistry and by the quest for the unknown. They believe that only the examined life is worth living..." },
    "Orange-Pink": { name: "Composer", description: "Composers are driven by self-expression and artistry and by experience, elegance, and beauty in all forms. They approach the act of creation..." },
    "Orange-Purple": { name: "Curator", description: "Curators are driven to express themselves through artistry and by a need to compassionately care for others. They seek novel and creative ways of doing things..." },
    "Orange-Red": { name: "Storyteller", description: "Storytellers are driven by self-expression and artistry and by a desire to cause others to get excited. They bring audiences together..." },
    "Orange-Silver": { name: "Nonconformist", description: "Nonconformists are driven by self-expression and artistry and by a desire to challenge the establishment. Their need to radically speak their truth..." },
    "Orange-Yellow": { name: "Ideator", description: "Ideators are driven by self-expression and artistry and by a need to innovate. They long to imagine and conceive of ingenious ideas..." },
    "Orange-Beige": { name: "Creator", description: "Orange Creators make up the world’s creative class because they are so imaginative, self-expressive, and intensely original. They are motivated by bringing new ideas..." },
    "Pink-Blue": { name: "Connoisseur", description: "Connoisseurs are driven by experience, elegance, and beauty in all forms, and by growth and being frontrunners. They have a sophisticated and discerning palate..." },
    "Pink-Maroon": { name: "Perfectionist", description: "Perfectionists are driven by experience, elegance, and beauty in all forms and by a need to overcome challenges. Their exacting standards for excellence..." },
    "Pink-Green": { name: "Philosopher", description: "Philosophers are driven by experience, elegance, and beauty in all forms and by the quest for the unknown. They are abstract thinkers who seek wisdom..." },
    "Pink-Orange": { name: "Virtuoso", description: "Virtuosos are driven by experience, elegance, and beauty in all forms and by self-expression and artistry. Their dazzling skill holds others spellbound..." },
    "Pink-Purple": { name: "Idealist", description: "Idealists are driven by experience, elegance, and beauty in all forms and by a need to compassionately care for others. They hold fast to a vision..." },
    "Pink-Red": { name: "Aficionado", description: "Aficionados are driven by experience, elegance, and beauty in all forms, and by a desire to cause others to get excited. They pursue their passions..." },
    "Pink-Silver": { name: "Refiner", description: "Refiners are driven by experience, elegance, and beauty in all forms and by a desire to challenge the establishment. They approach all pursuits intending to purify..." },
    "Pink-Yellow": { name: "Trendsetter", description: "Trendsetters are driven by experience, elegance, and beauty in all forms and by a need to invent the future through innovation. They dream up novel ideas..." },
    "Pink-Beige": { name: "Sophisticate", description: "Pink Sophisticates are a group’s connoisseurs with a refined palate and penchant for all that is excellent. They are experiential and at times even ethereal..." },
    "Purple-Blue": { name: "Guide", description: "Guides are driven by a need to compassionately care for others and by growth and being frontrunners. They are a motivating force whose influence..." },
    "Purple-Maroon": { name: "Guardian", description: "Guardians are driven by a need to compassionately care for others and by a resolve to overcome challenges. They believe that everyone matters equally..." },
    "Purple-Green": { name: "Shepherd", description: "Shepherds are driven by a need to compassionately care for others and by the quest for the unknown. They guide, guard, and watch over others..." },
    "Purple-Orange": { name: "Patron", description: "Patrons are driven by a need to compassionately care for others and by expressing themselves through artistry. They empower others to bring their creative dreams to life..." },
    "Purple-Pink": { name: "Confidant", description: "Confidants are driven by a need to compassionately care for others and by experience, elegance, and beauty in all its forms. They are the first that others turn to..." },
    "Purple-Red": { name: "Host", description: "Hosts are driven by a need to compassionately care for others and by a desire to cause others to get excited. They exemplify hospitality in their actions..." },
    "Purple-Silver": { name: "Advocate", description: "Advocates are driven by a need to compassionately care for others and by a desire to challenge the establishment. They selflessly support and promote the interests..." },
    "Purple-Yellow": { name: "Advisor", description: "Advisors are driven by a need to compassionately care for others and by a need to invent the future through innovation. People tend to flock to Advisors..." },
    "Purple-Beige": { name: "Provider", description: "A world without Purple Providers is one no one would want to endure. Purple Providers are selfless, compassionate, and naturally put the needs of others first..." },
    "Red-Blue": { name: "Motivator", description: "Motivators are driven to entertain and excite others and by growth and being frontrunners. They possess compelling charisma and charm..." },
    "Red-Maroon": { name: "Dynamo", description: "Dynamos are driven to cause others to get excited and by a need to overcome challenges. They are forceful and energetic individuals who are not shy..." },
    "Red-Green": { name: "Thrill-seeker", description: "Thrill-seekers are driven to cause others to get excited and by the quest for the unknown. They purposefully seek out and enjoy risk-laden activities..." },
    "Red-Orange": { name: "Performer", description: "Performers are driven to cause others to get excited and by self-expression and artistry. They are most engaged when in front of an audience..." },
    "Red-Pink": { name: "Enthusiast", description: "Enthusiasts are driven to cause others to get excited and by experience, elegance, and beauty in all forms. They are ardent supporters of people and causes..." },
    "Red-Purple": { name: "Emcee", description: "Emcees are driven to entertain and excite others and by a compassionate need to care for others. They draw energy and inspiration from the people around them..." },
    "Red-Silver": { name: "Daredevil", description: "Daredevils are driven to cause others to get excited and by a desire to challenge the establishment. They are reckless, bold, and pursue activities..." },
    "Red-Yellow": { name: "Magician", "description": "Magicians are driven to entertain and cause others to get excited and by a need to innovate. They make incredible things happen, tapping into boundless potential..." },
    "Red-Beige": { name: "Entertainer", description: "Red Entertainers elevate the daily mundane to something more vibrant, more sensational, and simply more fun. They generate excitement and enjoyment..." },
    "Silver-Blue": { name: "Ringleader", description: "Ringleaders are driven to challenge the establishment and by growth and being frontrunners. They are natural activators and inspire others to rally..." },
    "Silver-Maroon": { name: "Instigator", description: "Instigators are driven to disrupt the norm and by a need to overcome challenges. They cause others to question even their most sacred beliefs..." },
    "Silver-Green": { name: "Rogue", description: "Rogues are driven to challenge the establishment and by the quest for the unknown. They get lost in their own thoughts as they probe ideas..." },
    "Silver-Orange": { name: "Renegade", description: "Renegades are driven to challenge the establishment and by self-expression and artistry. They reject lawful and conventional behavior..." },
    "Silver-Pink": { name: "Individualist", description: "Individualists are driven to challenge the establishment and by experience, elegance, and beauty in all forms. They are quite comfortable pursuing independent courses..." },
    "Silver-Purple": { name: "Activist", description: "Activists are driven to challenge the establishment and by a need to compassionately care for others. They support bold and brazen action..." },
    "Silver-Red": { name: "Rock Star", description: "Rock Stars are driven to challenge the establishment and by a desire to entertain. Due to their commanding presence, star reputation..." },
    "Silver-Yellow": { name: "Free-thinker", description: "Free-thinkers are driven to challenge the establishment and by a need to innovate. Happily at home within their own thoughts, they are prone to speculate..." },
    "Silver-Beige": { name: "Rebel", description: "Without a doubt the most polarizing Archetype of them all, Silver Rebels are rule-breakers, system fighters, activists, and daredevils who refuse to conform..." },
    "Yellow-Blue": { name: "Vanguard", description: "Vanguards are driven to invent the future through innovation and by growth and being frontrunners. Always at the forefront of new concepts..." },
    "Yellow-Maroon": { name: "Inventor", description: "Inventors are driven to innovate and by a need to overcome challenges. They tirelessly toil to devise the new and novel. They take an ingenious approach..." },
    "Yellow-Green": { name: "Theorist", description: "Theorists are driven to invent the future through innovation and by the quest for the unknown. They form astonishing opinions and theories..." },
    "Yellow-Orange": { name: "Originator", description: "Originators are driven to innovation, self-expression, and artistry. Their imaginative and creative tendencies lead them to inventive ideas..." },
    "Yellow-Pink": { name: "Dreamer", description: "Dreamers are driven to innovate and by experience, elegance, and beauty in all forms. With heads often in the clouds, they are quite content to muse..." },
    "Yellow-Purple": { name: "Oracle", description: "Oracles are driven to innovate and by a need to compassionately care for others. Oracles have been gifted with the rare gift of foresight..." },
    "Yellow-Red": { name: "Futurist", description: "Futurists are driven to invent the future and by a desire to cause others to get excited. Their zest and zeal for life is strongest when thinking about the future..." },
    "Yellow-Silver": { name: "Reformer", description: "Reformers are driven to innovate and by a desire to challenge the establishment. They work for and advocate change, even if it flies in the face of established wisdom..." },
    "Yellow-Beige": { name: "Innovator", description: "Yellow Innovators are an instrumental—and sometimes rare—asset to any group, society, or culture. These are the individuals that need to invent, transform..." }
};