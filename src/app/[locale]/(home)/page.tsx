"use client";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import React, { useRef, useState } from "react";
import { appConfig } from "@/lib/appConfig";
import { globalLucideIcons as icons } from "@/components/global-icon";

const defaultSimpleContent = {
  edition: "Especial Edition",
  headline: "BREAKING NEWS",
  title: "JULIET'S BIRTHDAY NIGHT",
  mainText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus orci velit, porttitor nec justo eget, fermentum facilisis enim. Nullam ut tincidunt quam. Curabitur in tempus est. Suspendisse sed urna efficitur, eleifend sapien quis, consectetur libero. Aliquam laoreet commodo imperdiet. Nulla facilisi. Duis rhoncus vitae quam in finibus. Maecenas porttitor ultrices dolor at tempus. Sed feugiat felis quis mauris porttitor sollicitudin. Nullam cursus massa vel facilisis auctor. Vivamus vel tincidunt turpis. Integer consectetur elementum vestibulum.",
  sideTitle: "JULIET TELLS US HOW SHE PREPARED FOR HER PARTY.",
  sideDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
  bottomTitle: "MOM AND DAD, THE MOST ELEGANT OF THE NIGHT.",
  bottomDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  footer: "MORE INFORMATION AT WWW.REALLYGREATSITE.COM",
};
const defaultModernContent = {
  leftTop: "Special Edition",
  rightTop: "New York",
  headline: "Breaking News",
  subTitle: "BIRTHDAY PARTY INVITATION",
  aboutTitle: "About me",
  aboutText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  dateDay: "22",
  dateMonth: "NOV",
  dateAddr: "123\nAnywhere St.\nAny City",
  dateTime: "8 PM",
  joinTitle: "Join us!",
  joinText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

const defaultSimpleImgs = {
  mainImg: "/0.webp",
  sideImg: "/1.webp",
  bottomImg: "/4.webp",
};
const defaultModernImgs = {
  mainImg: "/6.webp",
  img1: "/2.webp",
};

export default function Home() {
  const [template, setTemplate] = useState<"simple" | "modern">("simple");
  const [simpleContent, setSimpleContent] = useState({ ...defaultSimpleContent });
  const [modernContent, setModernContent] = useState({ ...defaultModernContent });
  const [simpleImgs, setSimpleImgs] = useState({ ...defaultSimpleImgs });
  const [modernImgs, setModernImgs] = useState({ ...defaultModernImgs });
  const areaRef = useRef<HTMLDivElement>(null);
  const [closedAds, setClosedAds] = useState<string[]>([]);

  // 模板卡片排序
  const templates = [...appConfig.newspaperTemplates].sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0));
  const [selectedKey, setSelectedKey] = useState<string>(template);

  // 缩略图参数
  const THUMB_WIDTH = 240;
  const THUMB_HEIGHT = 309; // 700:900缩放
  const CARD_WIDTH = 260;
  const CARD_HEIGHT = 340;

  // 过滤已关闭广告
  const visibleTemplates = templates.filter(
    tpl => !(tpl.type === 'ads' && closedAds.includes(tpl.key))
  );

  const handleCloseAd = (key: string) => {
    setClosedAds(prev => [...prev, key]);
  };

  // 图片上传
  const handleImgChange = (type: string, key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (type === "simple") {
        setSimpleImgs(imgs => ({ ...imgs, [key]: e.target?.result as string }));
      } else {
        setModernImgs(imgs => ({ ...imgs, [key]: e.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 内容编辑
  const handleContentChange = (type: string, key: string, value: string) => {
    if (type === "simple") {
      setSimpleContent(c => ({ ...c, [key]: value }));
    } else {
      setModernContent(c => ({ ...c, [key]: value }));
    }
  };

  // 导出图片
  const handleExportImg = async () => {
    if (!areaRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(areaRef.current, { backgroundColor: null });
    const link = document.createElement("a");
    link.download = "newspaper.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  // 导出PDF
  const handleExportPDF = async () => {
    if (!areaRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(areaRef.current, { backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save("newspaper.pdf");
  };

  // 模板卡片区渲染函数
  const renderTemplatePreview = (tpl: any) => {
    return (
      <img src={tpl.thumb} alt={tpl.name} className="w-full h-full object-cover rounded" />
    );
  };

  // 卡片点击逻辑
  const handleTemplateCardClick = (tpl: any) => {
    if (tpl.href) {
      window.open(tpl.href, "_blank");
    } else {
      setTemplate(tpl.key);
      setSelectedKey(tpl.key);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      {/* 模板选择区和导出按钮 */}
      <div className="flex justify-center mt-6">
        <button onClick={handleExportImg} className="ml-6 px-4 py-1 rounded bg-gradient-to-r from-purple-400 to-pink-500 text-white">导出为图片</button>
        <button onClick={handleExportPDF} className="ml-2 px-4 py-1 rounded bg-gradient-to-r from-purple-400 to-pink-500 text-white">导出为PDF</button>
      </div>
      {/* 主体内容区 */}
      <main className="flex-1 flex justify-center items-start py-8 gap-10">
        {/* 报纸内容块 */}
        <section ref={areaRef} className="newspaper-bg shadow-lg rounded-lg px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 transition-colors duration-300 flex-shrink-0 mr-8">
          {template === "simple" ? (
            <NewspaperSimple
              mainImg={simpleImgs.mainImg}
              sideImg={simpleImgs.sideImg}
              bottomImg={simpleImgs.bottomImg}
              onMainImgChange={file => handleImgChange("simple", "mainImg", file)}
              onSideImgChange={file => handleImgChange("simple", "sideImg", file)}
              onBottomImgChange={file => handleImgChange("simple", "bottomImg", file)}
              content={simpleContent}
              onContentChange={(key, value) => handleContentChange("simple", key, value)}
            />
          ) : (
            <NewspaperModern
              mainImg={modernImgs.mainImg}
              img1={modernImgs.img1}
              onMainImgChange={file => handleImgChange("modern", "mainImg", file)}
              onImg1Change={file => handleImgChange("modern", "img1", file)}
              content={modernContent}
              onContentChange={(key, value) => handleContentChange("modern", key, value)}
            />
          )}
        </section>
        {/* 模板卡片区 */}
        <aside className="grid grid-cols-2 gap-4 w-[540px]">
          {visibleTemplates.map((tpl, idx) => (
            <div
              key={tpl.key}
              className={`relative cursor-pointer border rounded-xl shadow p-2 flex flex-col items-center bg-white transition-all duration-200 hover:shadow-lg ${selectedKey === tpl.key ? 'ring-2 ring-purple-400 border-purple-400' : 'border-neutral-200'} ${tpl.type === 'ads' ? 'bg-yellow-50' : 'bg-white'}`}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              onClick={() => handleTemplateCardClick(tpl)}
              title={tpl.name}
            >
              {/* 顶部名称和广告关闭按钮 */}
              <div className="w-full flex flex-row items-center justify-between px-1 pt-1 pb-1 select-none">
                <div className="text-base font-bold">
                  {tpl.type === 'ads'
                    ? <>
                        {tpl.name.replace(/(ad|ads)$/i, '').trim()}
                        <span className="ml-1 text-xs text-red-500 align-middle">Ad</span>
                      </>
                    : tpl.name}
                </div>
                {tpl.type === 'ads' && (
                  <button
                    className="text-neutral-400 hover:text-red-500 text-lg select-none p-0.5"
                    onClick={e => { e.stopPropagation(); handleCloseAd(tpl.key); }}
                    title="Close"
                  >
                    <icons.X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="w-full flex items-center justify-center overflow-hidden rounded" style={{ height: THUMB_HEIGHT }}>
                {renderTemplatePreview(tpl)}
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}

