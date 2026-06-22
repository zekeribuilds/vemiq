import React from 'react';
import { ReportPage } from './ReportPage';
import { ReportImage } from './ReportImage';

interface ChapterContent {
  type: 'text' | 'heading' | 'image' | 'list';
  content?: string;
  level?: number;
  src?: string;
  caption?: string;
  items?: string[];
}

interface ReportChapterProps {
  title: string;
  chapterNumber: number;
  content: ChapterContent[];
  startPage?: boolean;
}

export const ReportChapter: React.FC<ReportChapterProps> = ({
  title,
  chapterNumber,
  content,
  startPage = true,
}) => {
  const renderContent = (item: ChapterContent) => {
    switch (item.type) {
      case 'heading':
        const HeadingTag = `h${item.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag className={`font-bold mt-6 mb-4 ${item.level === 3 ? 'text-lg' : 'text-xl'}`}>
            {item.content}
          </HeadingTag>
        );
      
      case 'text':
        return (
          <p className="mb-4">
            {item.content}
          </p>
        );
      
      case 'image':
        return (
          <ReportImage
            src={item.src!}
            caption={item.caption}
            alt={item.content}
          />
        );
      
      case 'list':
        return (
          <ul className="list-disc ml-8 mb-4">
            {item.items?.map((listItem, index) => (
              <li key={index}>{listItem}</li>
            ))}
          </ul>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {startPage && (
        <ReportPage>
          <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-center mb-8">
              CHAPTER {chapterNumber}
            </h1>
            <h2 className="text-xl font-bold text-center">
              {title.toUpperCase()}
            </h2>
          </div>
        </ReportPage>
      )}
      
      <ReportPage>
        <div>
          {!startPage && (
            <>
              <h1 className="text-2xl font-bold text-center mb-8">
                CHAPTER {chapterNumber}
              </h1>
              <h2 className="text-xl font-bold text-center mb-8">
                {title.toUpperCase()}
              </h2>
            </>
          )}
          
          {content.map((item, index) => (
            <div key={index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </ReportPage>
    </>
  );
};
