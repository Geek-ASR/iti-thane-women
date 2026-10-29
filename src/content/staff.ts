import type { L } from '@/lib/i18n';

export type StaffMember = { name: string; post: L; trade?: string };
export type StaffGroup = { id: string; title: L; members: StaffMember[] };

const CI: L = { en: 'Craft Instructor', mr: 'शिल्प निदेशक' };

/** Directory as per institute records — the admin portal can update it when staff change. */
export const staffGroups: StaffGroup[] = [
  {
    id: 'leadership',
    title: { en: 'Leadership', mr: 'नेतृत्व' },
    members: [
      { name: 'Mrs. Smita S. Mane', post: { en: 'Principal', mr: 'प्राचार्य' } },
      { name: 'Mr. Harishchandra Manje', post: { en: 'Group Instructor', mr: 'गट निदेशक' } },
    ],
  },
  {
    id: 'engineering',
    title: { en: 'Engineering trades', mr: 'अभियांत्रिकी व्यवसाय' },
    members: [
      { name: 'Mr. Prashant Sundar Ghanghav', post: CI, trade: 'Electrician' },
      { name: 'Mrs. Prajakta Chagan Desai', post: CI, trade: 'Electrician' },
      { name: 'Mrs. Anita Tulsidas Borse', post: CI, trade: 'Electronics Mechanic' },
      { name: 'Mrs. Ujwala Eknath Katkade', post: CI, trade: 'Electronics Mechanic' },
      { name: 'Mr. Jitendra Sambhaji Garud', post: CI, trade: 'Electronics Mechanic' },
      { name: 'Mr. Sudhakar Vitthal Rathor', post: CI, trade: 'Technician Medical Electronics' },
      { name: 'Miss Dhanashree Kadam', post: CI, trade: 'ICTSM' },
      { name: 'Mrs. Jyoti Shashank Gawand', post: CI, trade: 'ICTSM' },
      { name: 'Mr. Sachin Popat Sonawane', post: { en: 'Maths & Drawing Instructor', mr: 'गणित व चित्रकला निदेशक' } },
    ],
  },
  {
    id: 'non-engineering',
    title: { en: 'Non-engineering trades', mr: 'बिगर-अभियांत्रिकी व्यवसाय' },
    members: [
      { name: 'Mrs. Priyanka Prakash Rasal', post: CI, trade: 'COPA' },
      { name: 'Mr. Surendra Lakshman Rekha', post: CI, trade: 'COPA' },
      { name: 'Miss Vasanti Nevrekar', post: CI, trade: 'Cosmetology' },
      { name: 'Mrs. Manjari Dhabholkar', post: CI, trade: 'Cosmetology' },
      { name: 'Mrs. Rekha Sandip Patil', post: CI, trade: 'Fashion Design & Technology' },
      { name: 'Mrs. Dhanashree Desai', post: CI, trade: 'Interior Design & Decoration' },
      { name: 'Mrs. Megha Chandrakant Ankamvar', post: CI, trade: 'Sewing Technology' },
      { name: 'Mrs. Pradnya Pravin Mayekar', post: CI, trade: 'Secretarial Practice' },
    ],
  },
  {
    id: 'office',
    title: { en: 'Administration', mr: 'प्रशासन' },
    members: [
      { name: 'Mrs. Sharda Salam', post: { en: 'Head Clerk', mr: 'मुख्य लिपिक' } },
      { name: 'Mrs. Purva Parag Sankhe', post: { en: 'Store Keeper', mr: 'भांडारपाल' } },
      { name: 'Mrs. Sapna Sonawane', post: { en: 'Senior Clerk', mr: 'वरिष्ठ लिपिक' } },
      { name: 'Mrs. Priti Waghmode', post: { en: 'Senior Clerk', mr: 'वरिष्ठ लिपिक' } },
      { name: 'Mr. Sunil Soyam', post: { en: 'Junior Clerk', mr: 'कनिष्ठ लिपिक' } },
    ],
  },
  {
    id: 'support',
    title: { en: 'Support staff', mr: 'सहाय्यक कर्मचारी' },
    members: [
      { name: 'Mr. Hitendra Bhiku Margaje', post: { en: 'Peon', mr: 'शिपाई' } },
      { name: 'Mrs. Sitaben Babubhai Gavra', post: { en: 'Peon', mr: 'शिपाई' } },
      { name: 'Mrs. Kalpana Balkrishna Mankame', post: { en: 'Peon', mr: 'शिपाई' } },
      { name: 'Mrs. Pramila Ramhit Ahir', post: { en: 'Peon', mr: 'शिपाई' } },
    ],
  },
];

/** Sanctioned posts (DPR). */
export const sanctionedPosts = { sanctioned: 34, filled: 28, vacant: 6 };
