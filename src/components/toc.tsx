'use client';

import { LastUpdatedDate, LLMCopyButton } from '@/components/toc-base';

interface TocFooterProps {
  /**
   * The last modified date of the page.
   */
  lastModified: Date | undefined;
}

export function TocFooter({ lastModified }: TocFooterProps) {
  return (
    <div className="flex flex-col gap-y-2 items-start m-4">
      <LastUpdatedDate gitTimestamp={lastModified} />
      <LLMCopyButton />
    </div>
  );
} 