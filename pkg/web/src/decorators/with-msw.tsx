import { Decorator } from "@storybook/nextjs";
import { worker } from "../mocks/browser";
import { useEffect } from "react";

export const withMSW: Decorator = (Story, context) => {
  const { parameters } = context;
  const { msw } = parameters || {};

  // Decorator内でのReact Hook使用のための関数コンポーネント
  const MSWWrapper = () => {
    useEffect(() => {
      // StorybookでMSWを開始
      if (typeof window !== "undefined") {
        worker.start({
          onUnhandledRequest: "warn",
          quiet: false,
        });

        // ストーリーレベルのハンドラーがある場合は追加
        if (msw?.handlers) {
          worker.use(...msw.handlers);
        }

        return () => {
          // ストーリーレベルのハンドラーをリセット
          if (msw?.handlers) {
            worker.resetHandlers();
          }
          worker.stop();
        };
      }
    }, []);

    return <Story {...context} />;
  };

  return <MSWWrapper />;
};
