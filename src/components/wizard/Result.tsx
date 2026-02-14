import Link from 'next/link';
import { ReactElement } from 'react';

interface ResultProps {
  result: string;
  onStartOver: () => void;
}

export default function Result({ result, onStartOver }: ResultProps) {
  // Helper to close and render a list
  const closeList = (list: { type: 'ol' | 'ul'; items: string[] }, key: string) => {
    if (list.type === 'ol') {
      return (
        <ol key={key} className="ml-6 mb-4 list-decimal">
          {list.items.map((item, idx) => (
            <li key={idx} className="mb-2 text-lg">{item}</li>
          ))}
        </ol>
      );
    } else {
      return (
        <ul key={key} className="ml-6 mb-4 list-disc">
          {list.items.map((item, idx) => (
            <li key={idx} className="mb-2 text-lg">{item}</li>
          ))}
        </ul>
      );
    }
  };
  
  // Format the result text with basic markdown-like formatting
  const formatResult = (text: string) => {
    const lines = text.split('\n');
    const elements: ReactElement[] = [];
    type ListState = { type: 'ol' | 'ul'; items: string[] };
    let currentList: ListState | null = null;
    
    lines.forEach((line, i) => {
      // Headers (lines that end with :)
      if (line.trim().endsWith(':') && line.trim().length > 1) {
        // Close any open list
        if (currentList) {
          elements.push(closeList(currentList, `list-${elements.length}`));
          currentList = null;
        }
        
        elements.push(
          <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-primary">
            {line}
          </h3>
        );
        return;
      }
      
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        const content = line.trim().replace(/^\d+\.\s*/, '');
        
        if (currentList?.type === 'ul') {
          // Close bullet list, start numbered list
          elements.push(closeList(currentList, `list-${elements.length}`));
          currentList = { type: 'ol', items: [content] };
        } else if (currentList?.type === 'ol') {
          // Continue numbered list
          currentList.items.push(content);
        } else {
          // Start new numbered list
          currentList = { type: 'ol', items: [content] };
        }
        return;
      }
      
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        const content = line.trim().replace(/^[-•]\s*/, '');
        
        if (currentList?.type === 'ol') {
          // Close numbered list, start bullet list
          elements.push(closeList(currentList, `list-${elements.length}`));
          currentList = { type: 'ul', items: [content] };
        } else if (currentList?.type === 'ul') {
          // Continue bullet list
          currentList.items.push(content);
        } else {
          // Start new bullet list
          currentList = { type: 'ul', items: [content] };
        }
        return;
      }
      
      // Close any open list for non-list content
      if (currentList) {
        elements.push(closeList(currentList, `list-${elements.length}`));
        currentList = null;
      }
      
      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-4" />);
        return;
      }
      
      // Regular paragraphs
      elements.push(
        <p key={i} className="mb-4 text-lg leading-relaxed">
          {line}
        </p>
      );
    });
    
    // Close any remaining open list
    if (currentList) {
      elements.push(closeList(currentList, `list-${elements.length}`));
    }
    
    return elements;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="card-title text-3xl text-primary">
              ✨ Your Results
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {formatResult(result)}
          </div>
          
          <div className="card-actions justify-center gap-4 mt-8">
            <button
              onClick={onStartOver}
              className="btn btn-outline btn-lg"
            >
              Start Over
            </button>
            <Link href="/" className="btn btn-primary btn-lg">
              Try Another
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
