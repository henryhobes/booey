import Link from 'next/link';

interface ResultProps {
  result: string;
  onStartOver: () => void;
}

export default function Result({ result, onStartOver }: ResultProps) {
  // Format the result text with basic markdown-like formatting
  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers (lines that end with :)
      if (line.trim().endsWith(':') && line.trim().length > 1) {
        return (
          <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-primary">
            {line}
          </h3>
        );
      }
      
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={i} className="ml-6 mb-2 text-lg">
            {line.trim().replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={i} className="ml-6 mb-2 text-lg">
            {line.trim().replace(/^[-•]\s*/, '')}
          </li>
        );
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={i} className="h-4" />;
      }
      
      // Regular paragraphs
      return (
        <p key={i} className="mb-4 text-lg leading-relaxed">
          {line}
        </p>
      );
    });
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
