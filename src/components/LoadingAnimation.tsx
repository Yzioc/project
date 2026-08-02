interface LoadingAnimationProps {
  gender: 'female' | 'male';
}

export function LoadingAnimation({ gender }: LoadingAnimationProps) {
  const pronoun = gender === 'female' ? '她' : '他';

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-sm shrink-0">
        TA
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
        <span className="text-sm text-gray-500">{pronoun}正在思考...</span>
      </div>
    </div>
  );
}
