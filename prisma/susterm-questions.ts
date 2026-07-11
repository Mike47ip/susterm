// Hand-curated from the SusTerm Dictionary PDF (first 10, for approval before
// generating the rest). Pattern: the dictionary "Example" becomes the question,
// with the term itself hashed out as "........" (and the sentence trimmed /
// turned into a "...?" when the blank falls at the end). `definition` is the
// dictionary's own definition, shown to the user after a wrong answer.
import { Option } from "@prisma/client";

export const susTermQuestions: {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: Option;
  definition: string;
}[] = [
  {
    // 1. 1.5 DEGREES
    text: 'At the 2015 Paris Climate Conference (COP21), over 190 countries agreed to work together to keep global warming "well below 2°C", and to make efforts to limit it to ........?',
    optionA: "1.5",
    optionB: "23",
    optionC: "44",
    optionD: "6",
    correctOption: "A",
    definition:
      'The "1.5 degrees" goal refers to an international target to limit the average increase in Earth\'s temperature to no more than 1.5 degrees Celsius above pre-industrial levels (around 1850). Going above 1.5°C of warming brings much worse risks — stronger hurricanes, deadlier heatwaves, higher sea levels, and more damage to wildlife and food systems.',
  },
  {
    // 2. AA1000 ASSURANCE STANDARD
    text: "A major company like Coca-Cola might publish a sustainability report saying it reduced its water usage by 30%. An assurance provider can use the ........ to check the data and processes, making sure the information is accurate and not misleading before the public sees it.",
    optionA: "Carbon Trust Standard",
    optionB: "AA1000 Assurance Standard",
    optionC: "International Standard on Assurance Engagements 3000 (ISAE 3000)",
    optionD: "Global Reporting Initiative (GRI) Framework",
    correctOption: "B",
    definition:
      "The AA1000 Assurance Standard is a set of international rules that help check if a company's sustainability information (like reports on their climate actions, social programs, etc.) is true, clear, and trustworthy.",
  },
  {
    // 3. ABATEMENT
    text: "A power plant that switches from burning coal to using solar panels is performing ........ because it lowers the amount of carbon dioxide it releases into the air.",
    optionA: "Decarbonisation",
    optionB: "Carbon Offsetting",
    optionC: "Abatement",
    optionD: "Mitigation",
    correctOption: "C",
    definition:
      "Abatement means taking action to reduce or remove harmful pollution, especially greenhouse gases like carbon dioxide, from the atmosphere.",
  },
  {
    // 4. ABSOLUTE CONTRACTION
    text: "If a city emitted 2 million tons of CO\u2082 in 2020, ........ would mean that by 2030, it must reduce emissions to something like 1 million tons, even if its population or economy grows during that time.",
    optionA: "Absolute Target",
    optionB: "Two-Degree Limit / Two-Degree Target",
    optionC: "Absolute Reductions",
    optionD: "Absolute Contraction",
    correctOption: "D",
    definition:
      "Absolute contraction is when a country, business, or organization must reduce its total greenhouse gas emissions by a specific, real amount — not just slow down how fast it grows.",
  },
  {
    // 5. ABSOLUTE REDUCTIONS (term isn't named in the example itself)
    text: "A factory produced 10,000 tons of emissions in 2020 and cuts it down to 7,000 tons in 2025.",
    optionA: "Absolute Reductions",
    optionB: "Two-Degree Limit / Two-Degree Target",
    optionC: "Absolute Contraction",
    optionD: "Absolute Target",
    correctOption: "A",
    definition:
      "Absolute reductions mean lowering the total quantity of emissions (not relative to business size, production levels, or profits).",
  },
  {
    // 6. ABSOLUTE TARGET
    text: 'A company like Apple might say: "We aim to cut our total carbon emissions by 60% by 2030 compared to 2019 levels." This is an ........ because it is a fixed goal, no matter how much the company grows.',
    optionA: "Long-Term Science-Based Targets",
    optionB: "Absolute Contraction",
    optionC: "Absolute Target",
    optionD: "Absolute Reductions",
    correctOption: "C",
    definition:
      "An absolute target is a fixed goal to reduce total greenhouse gas emissions by a specific number or percentage, within a certain timeframe.",
  },
  {
    // 7. ACTIVE OWNERSHIP (term isn't named in the example itself)
    text: "An investment fund that owns shares in an oil company might pressure the company to invest in renewable energy and cut emissions by speaking out at shareholder meetings and voting for better policies.",
    optionA: "Water Stewardship",
    optionB: "Active Ownership",
    optionC: "Product Stewardship",
    optionD: "Communication + Engagement",
    correctOption: "B",
    definition:
      "Active ownership means that investors (like shareholders) use their rights to influence the companies they invest in — pushing them to act in a more sustainable and responsible way.",
  },
  {
    // 8. ACTIVE TRANSPORT
    text: "Instead of driving 2 kilometers to work, a person rides a bicycle every day. That is ........, it improves health and cuts pollution!",
    optionA: "Green Transport",
    optionB: "Smart Grid",
    optionC: "Active Transport",
    optionD: "Sustainable Transport",
    correctOption: "C",
    definition:
      "Active transport is moving from place to place using your own physical energy, like walking, biking, running, or even skating, instead of using motorized transport like cars or buses.",
  },
  {
    // 9. ADAPTATION
    text: "Farmers planting drought-resistant crops because rainfall patterns are changing is a good example of ........ to climate change.",
    optionA: "Adaptive Capacity",
    optionB: "Adaptation",
    optionC: "Climate Resilience",
    optionD: "Adaptation Strategies",
    correctOption: "B",
    definition:
      "Adaptation means changing our behaviour, environment, or systems to deal with the current or expected effects of climate change. Instead of stopping climate change (mitigation), adaptation is about getting ready for it and reducing the harm it can cause.",
  },
  {
    // 10. ADAPTATION STRATEGIES
    text: "A coastal city like Miami building stronger sea walls and raising roads to protect against sea-level rise is using ........?",
    optionA: "Climate Resilience",
    optionB: "Disaster Resilience",
    optionC: "Adaptation",
    optionD: "Adaptation Strategies",
    correctOption: "D",
    definition:
      "Adaptation strategies are plans or actions that communities, governments, and businesses create to adjust to the impacts of climate change.",
  },
];
