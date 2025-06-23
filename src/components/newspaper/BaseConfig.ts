import { NewspaperSimple } from '@/components/newspaper/NewspaperSimple';
import { NewspaperModern } from '@/components/newspaper/NewspaperModern';

export const NEWSPAPER_TEMPLATES = {
  simple: {
    name: 'Minimal Newspaper',
    component: NewspaperSimple,
    defaultContent: {
      edition: 'Newspaper Template',
      headline: 'NEWSPAPER',
      title: "NEWSPAPER TEMPLATE",
      mainText: 'The Newspaper Template provides a timeless layout, ideal for delivering breaking news or captivating stories. Featuring a bold headline section, the Newspaper Template instantly grabs attention with its striking design. Perfect for crafting professional newsletters or special editions, the Newspaper Template seamlessly blends style and functionality. Utilize the Newspaper Template for personal projects, school newspapers, or business updates by customizing text and graphics to meet your specific needs.',
      sideTitle: 'EDIT TEXT DIRECTLY IN THE TEXT AREA.',
      sideDesc: 'Hover over the images to show the upload button in the bottom right corner, then click to upload a new picture.',
      bottomTitle: 'BEAUTIFUL NEWSPAPER TEMPLATE',
      bottomDesc: 'The Newspaper Template is user-friendly and adaptable for any occasion.',
      footer: 'MORE TEMPLATES AT NEWSPAPER-TEMPLATE.ORG',
    },
    defaultImgs: {
      mainImg: '/0.webp',
      sideImg: '/1.webp',
      bottomImg: '/4.webp',
    },
  },
  modern: {
    name: 'Modern Magazine',
    component: NewspaperModern,
    defaultContent: {
      leftTop: 'Newspaper',
      rightTop: 'Template',
      headline: 'Newspaper',
      subTitle: 'Newspaper Template',
      aboutTitle: 'Newspaper',
      aboutText: 'The Newspaper Template provides a timeless layout, ideal for delivering breaking news or captivating stories. Featuring a bold headline section, the Newspaper Template instantly grabs attention with its striking design. Perfect for crafting professional or special editions.',
      dateDay: '28',
      dateMonth: 'JUN',
      addr1: 'Big event',
      addr2: 'Interesting',
      addr3: 'Happy',
      dateTime: 'Important',
      joinTitle: 'Easy to use',
      joinText: 'It\'s quick and easy to Use. Edit text directly in the text area and hover over the images to show the upload button in the bottom right corner, then click to upload a new picture.',
    },
    defaultImgs: {
      mainImg: '/6.webp',
      subImg: '/2.webp',
      flowers: '/flowers.png',
    },
  },
};

export { NewspaperSimple, NewspaperModern }; 