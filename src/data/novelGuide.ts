export interface NovelChapter {
  chapter: number;
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface CharacterProfile {
  name: string;
  role: string;
  description: string;
}

export const NOVEL_INFO = {
  title: 'The Life Changer',
  author: 'Khadija Abubakar Jalli',
  genre: 'Fiction / Campus Novella',
  compulsoryExam: 'JAMB UTME Use of English (Sections A & B)',
  overview:
    'The Life Changer is a compulsory novel set in Nigerian university and domestic life. It chronicles the university admission experience of Salma and the moral, social, and academic dilemmas undergraduates face, framed through stories told by Ummi to her children Bint, Omar, Teemah, and Jamila.',
  characters: [
    {
      name: 'Ummi',
      role: 'Mother / Primary Narrator',
      description: 'The wise mother of Omar, Bint, Teemah, and Jamila. She tells her children stories about university life, Lafayette, and morality to prepare Omar for campus.',
    },
    {
      name: 'Salma',
      role: 'Protagonist / Undergrad Candidate',
      description: 'An arrogant, sophisticated girl admitted into the university. She looks down on customs, gets involved in examination malpractice, bribes a lecturer, and falls into a fraud syndicate run by Habib and Doctor Kabir.',
    },
    {
      name: 'Omar',
      role: 'Ummi’s first child & son',
      description: 'Just gained admission to study Law at Ahmadu Bello University (ABU) Zaria with 230 in JAMB. The novel is framed around celebrating his admission.',
    },
    {
      name: 'Bint',
      role: 'Ummi’s youngest daughter',
      description: 'A brilliant primary school pupil who challenged her teacher Mallam Salihu with a French greeting ("Bonjour, Ça va?"), showing that teachers should be open to learning.',
    },
    {
      name: 'Tomiwa',
      role: 'Salma’s Roommate (Ibadan)',
      description: 'A brilliant, religious Yoruba girl from Ibadan studying Chemistry. Known for preparing fine meals and resolving misunderstandings among roommates.',
    },
    {
      name: 'Doctor Kabir',
      role: 'Laboratory Technologist / Conman',
      description: 'A fraudulent university lab technologist nicknamed "Doctor" who deceived Salma with promises of contacting the Committee on Examination Malpractice (EMC) and disappeared with her money to gamble.',
    },
    {
      name: 'Honourable Habib & SG (Sylvester)',
      role: 'Politician & Aide',
      description: 'A corrupt politician who gave money and cars to university girls, mistakenly connecting Salma to Kabir’s betting trap.',
    },
    {
      name: 'Kolawole Abdul',
      role: 'Exam Malpractice Student',
      description: 'The intelligent student who passed answers (touts/notes) to Salma during the General Studies (GST) exam, leading to both of them being expelled.',
    },
  ] as CharacterProfile[],
  chapters: [
    {
      chapter: 1,
      title: 'Omar’s Admission & Bint’s Classroom Wit',
      summary: 'Omar scores 230 in JAMB and secures admission for Law. The family gathers in joy. Bint recounts how she embarrassed her French-claiming teacher Mallam Salihu in school.',
      keyPoints: [
        'Omar scored 230 in UTME to read Law.',
        'Bint used "Bonjour, Ça va?" with her teacher.',
        'Ummi introduces the concept that university transforms individuals (The Life Changer).',
      ],
    },
    {
      chapter: 2,
      title: 'Ummi’s University Days & The Quiet Village',
      summary: 'Ummi describes her marriage and entrance into university, including the tradition of quiet Lafayette village and the strict moral expectations.',
      keyPoints: [
        'Lafayette tradition of early marriage and communal respect.',
        'Ummi entered university already married.',
        'Dr. Samuel Johnson’s quote about knowledge without integrity.',
      ],
    },
    {
      chapter: 3,
      title: 'The Tale of the Blind Man (Quiet)',
      summary: 'Ummi recounts a story about a blind man who walked into Lafayette and teaches lessons on deception, fate, and community trust.',
      keyPoints: [
        'Physical blindness vs moral blindness.',
        'The villagers learn not to judge purely on appearances.',
      ],
    },
    {
      chapter: 4,
      title: 'Salma’s Registration & Disdain for Modesty',
      summary: 'Salma arrives at the university campus with vanity, ridiculing queue systems and lecturing staff until she encounters a dignified female lecturer who humbles her.',
      keyPoints: [
        'Salma is proud and arrogant at the faculty office.',
        'She tries to flirt and bypass rules during registration.',
        'She is humbled by the Lecturer-in-charge.',
      ],
    },
    {
      chapter: 5,
      title: 'Room 37 & The Three Roommates',
      summary: 'Salma moves to Queen Amina Hall, Room 37. She is paired with Tomiwa (Yoruba), Ada (Middle Belt), and Ngozi (Easterner), portraying Nigerian ethnic harmony.',
      keyPoints: [
        'Room 37 represents national integration (Yoruba, Igbo, Hausa, minority).',
        'Tomiwa is neat and culinary-skilled.',
        'Salma’s fake lifestyle vs genuine roommate camaraderie.',
      ],
    },
    {
      chapter: 6,
      title: 'The Betrayal & The Car Ride',
      summary: 'Salma is picked up by Habib and SG. Due to confusion, Tomiwa ends up going instead, leading to a financial gift and jealousy from Salma.',
      keyPoints: [
        'Habib is an influential politician.',
        'Salma introduces Habib to her lifestyle.',
        'Greed and materialism among university students.',
      ],
    },
    {
      chapter: 7,
      title: 'Examination Malpractice & Kolawole Abdul',
      summary: 'Salma neglects her studies and relies on cheating during the final GST paper. She copies from Kolawole Abdul and is caught by an invigilator.',
      keyPoints: [
        'Salma signs the Examination Malpractice Form (EMC).',
        'Kolawole Abdul is also apprehended as an accomplice.',
        'Both face expulsion from the university.',
      ],
    },
    {
      chapter: 8,
      title: 'Doctor Kabir’s Gambling Sting',
      summary: 'Salma pays ₦100,000 to "Doctor" Kabir to fix the EMC committee. Kabir takes the money straight to a gambling den and loses it all, then is robbed on his way out.',
      keyPoints: [
        'Doctor Kabir is not an academic doctor, but a lab technician.',
        'He loses Salma’s bribe at a local gambling joint.',
        'Salma learns the painful cost of shortcuts.',
      ],
    },
    {
      chapter: 9,
      title: 'Resolution, Expulsion & Omar’s Caution',
      summary: 'Salma is officially expelled. Ummi ends the tale with solemn advice to Omar, who promises to shun bad company and study diligently.',
      keyPoints: [
        'Salma’s regret and reformed perspective.',
        'University is truly a "Life Changer" for better or worse.',
        'Omar commits to moral uprightness.',
      ],
    },
  ] as NovelChapter[],
};
