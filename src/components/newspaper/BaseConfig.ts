import { NewspaperSimple } from '@/components/newspaper/NewspaperSimple';
import { NewspaperModern } from '@/components/newspaper/NewspaperModern';
import { NewspaperSongChinese } from '@/components/newspaper/NewspaperSongChinese';
import { NewspaperSongEnglish } from '@/components/newspaper/NewspaperSongEnglish';

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
      aiTitleMaxChars: 30,
      aiMaxChars: 600
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
      aiTitleMaxChars: 30,
      aiMaxChars: 600
    },
    defaultImgs: {
      mainImg: '/6.webp',
      subImg: '/2.webp',
      flowers: '/flowers.png',
    },
  },
  song_cn: {
    name: 'Chinese Song Poster',
    component: NewspaperSongChinese,
    defaultContent: {
      headerLeft: 'AI音乐·古风',
      headerRight: '《鹅城雨》·专辑Yimo',
      headline: '鹅城雨',
      subTitle: '鹅城雨',
      subTitleText: '词曲：Sunopedia<br>编曲：Grok/SUNO<br>演唱：SUNO<div>制作：@sunopedia</div><div>封面：musicposter.org<br>海报：newspaper-template.org<div>视频号：@Sunopedia</div></div><div>油管：@WindRun-Huaiin</div>',
      lyrics: '窗柩上的雨惹了谁的心&nbsp;风掠过檐角吹不散初影<div>砚台上的笔渐渐被唤醒&nbsp;墨迹挥毫却字字不语</div><div>那声叹息还在风里停<br>掌纹里的痕刻着谁的名&nbsp;烟花易冷后灯火也昏暝</div><div>故事里的景慢慢被擦去&nbsp;蓦然回首却步步无力</div><div>那段过往不愿再触及</div><div>雨落的声音动了谁的情&nbsp;往事如烟悄然复凌<br>时而绵密沾湿了衣襟&nbsp;将我带入那茫茫的追忆<br>时而骤急敲打着孤寂&nbsp;把我困进这深深的泥泞<br>想质问天叩问地&nbsp;好一句云淡风轻<br>&nbsp; &nbsp; &nbsp; ·二零二五年十二月十八日凌晨</div>',
      sideText: '一场淅淅沥沥的雨，把旧日的影子从鹅城老街的青石板上一点点洗出来。&nbsp;<div>琴声轻叩心门，古筝与二胡低诉叹息，弦乐如潮，涌进那些再也回不去的追忆。&nbsp;</div><div>雨中怀旧氛围漫延，诗意深沉、余韵悠长。<div>时而绵密浸透衣襟，时而骤急撞碎孤寂。\n最后只剩一句云淡风轻和雨声淡入夜色。</div></div>',
      footerText: 'LISTEN NOW:  https://suno.com/song/72d6c24a-d328-4187-81c3-cb037adef537',
      headlineFont: 'xingkai',
      lyricsFont: 'xingkai',
      headerLeftFont: 'quicksand',
      headerRightFont: 'quicksand',
      subTitleFont: 'hanyi',
      subTitleTextFont: 'quicksand',
      sideTextFont: 'nokia',
      headlineSize: 60,
      subTitleSize: 24,
      lyricsSize: 34
    },
    defaultImgs: {
      mainImg: '/1.webp',
      flowers: '/flowers.png',
    },
  },
  song_en: {
    name: 'English Song Poster',
    component: NewspaperSongEnglish,
    defaultContent: {
      headline: 'Love Story',
      subTitle: 'Taylor Swift',
      lyrics: "We were both young when I first saw you\nI close my eyes and the flashback starts\nI'm standing there\nOn a balcony in summer air\nSee the lights, see the party, the ball gowns\nSee you make your way through the crowd\nAnd say, \"Hello\"\nLittle did I know...",
      sideText: 'RELEASED: SEP 2008\nGENRE: COUNTRY POP',
      footerText: 'DESIGNED BY NEWSPAPER TEMPLATE',
      headlineFont: 'alexBrush',
      lyricsFont: 'quicksand',
      headlineSize: 72,
      subTitleSize: 18,
      lyricsSize: 20
    },
    defaultImgs: {
      mainImg: '/4.webp',
    },
  },
};

export { NewspaperSimple, NewspaperModern, NewspaperSongChinese, NewspaperSongEnglish }; 
