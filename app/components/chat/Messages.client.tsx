import type { Message } from 'ai';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import WithTooltip from '~/components/ui/Tooltip';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import { useLocation } from '@remix-run/react';
import { Fragment } from 'react';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref: ForwardedRef<HTMLDivElement> | undefined) => {
  const { id, isStreaming = false, messages = [] } = props;
  const location = useLocation();

  const handleRewind = (messageId: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('rewindTo', messageId);
    window.location.search = searchParams.toString();
  };
  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content, id: messageId, annotations } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;
            const isHidden = annotations?.includes('hidden');

            if (isHidden) {
              return <Fragment key={index} />;
            }

            return (
              <div
                key={index}
                className={classNames('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                  'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                    isStreaming && isLast,
                  'mt-4': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden bg-white text-gray-600 rounded-full shrink-0 self-start">
                    <div className="i-ph:user-fill text-xl"></div>
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                {isUserMessage ? (
                      <UserMessage content={content} />
                    ) : (
                      <AssistantMessage content={content} annotations={message.annotations} />
                    )}                </div>
                {!isUserMessage && (
                    <div className="flex gap-2 flex-col lg:flex-row">
                      {messageId && (
                        <WithTooltip tooltip="Revert to this message">
                          <button
                            onClick={() => handleRewind(messageId)}
                            key="i-ph:arrow-u-up-left"
                            className={classNames(
                              'i-ph:arrow-u-up-left',
                              'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                            )}
                          />
                        </WithTooltip>
                      )}
                    </div>
                  )}
              </div>
            );
          })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
      )}
    </div>
  );
});
