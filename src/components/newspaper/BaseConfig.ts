import { NewspaperSimple } from '@/components/newspaper/NewspaperSimple';
import { NewspaperModern } from '@/components/newspaper/NewspaperModern';

export const NEWSPAPER_TEMPLATES = {
  simple: {
    name: 'Minimal Newspaper',
    component: NewspaperSimple,
    defaultContent: {
      edition: 'Especial Edition',
      headline: 'BREAKING NEWS',
      title: "JULIET'S BIRTHDAY NIGHT",
      mainText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus orci velit, porttitor nec justo eget, fermentum facilisis enim. Nullam ut tincidunt quam. Curabitur in tempus est. Suspendisse sed urna efficitur, eleifend sapien quis, consectetur libero. Aliquam laoreet commodo imperdiet. Nulla facilisi. Duis rhoncus vitae quam in finibus. Maecenas porttitor ultrices dolor at tempus. Sed feugiat felis quis mauris porttitor sollicitudin. Nullam cursus massa vel facilisis auctor. Vivamus vel tincidunt turpis. Integer consectetur elementum vestibulum.',
      sideTitle: 'JULIET TELLS US HOW SHE PREPARED FOR HER PARTY.',
      sideDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.',
      bottomTitle: 'MOM AND DAD, THE MOST ELEGANT OF THE NIGHT.',
      bottomDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      footer: 'MORE INFORMATION AT WWW.REALLYGREATSITE.COM',
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
      leftTop: 'Special Edition',
      rightTop: 'New York',
      headline: 'Breaking News',
      subTitle: 'BIRTHDAY PARTY INVITATION',
      aboutTitle: 'About me',
      aboutText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      dateDay: '22',
      dateMonth: 'NOV',
      dateAddr: '123\nAnywhere St.\nAny City',
      dateTime: '8 PM',
      joinTitle: 'Join us!',
      joinText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    defaultImgs: {
      mainImg: '/6.webp',
      img1: '/2.webp',
    },
  },
};

export { NewspaperSimple, NewspaperModern }; 