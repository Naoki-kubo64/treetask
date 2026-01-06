export type Locale = 'en' | 'ja';

export const translations = {
  en: {
    common: {
      search: "Search tasks...",
      delete: "Delete",
    },
    skins: {
      title: "Select Skin",
      active: "Active",
    },
    history: {
      undo: "Undo",
      redo: "Redo",
    },
    tabs: {
      act: "Act",
      pages: "Pages",
      info: "Info",
      inspect: "Inspect",
    },
    nextActions: {
      title: "Next Actions",
      subtitle: "Focus on these tasks to make progress.",
      empty: "All clear! 🎉",
      emptySub: "Add more tasks to the tree.",
    },
    canvas: {
      addTask: "+ Add Task",
      addToConnect: "Add to connect",
      addToPlaceFree: "Add to place free",
      deleteSelected: "Delete Selected",
    },
    info: {
      title: "How to use",
      description: "Quick guide and keyboard shortcuts.",
      shortcuts: "Shortcuts",
      interactions: "Interactions",
      shortcutItems: {
        addChild: "Add Child",
        addSibling: "Add Sibling",
        delete: "Delete",
        editText: "Edit Text",
      },
      interactionItems: {
        reparent: "Reparent: Drag a node over another to connect.",
        edgeStyle: "Edge Style: Click a line to change color/style.",
        multiSelect: "Multi-Select: Shift + Drag to select multiple.",
        skins: "Skins: Switch themes in the top-right panel.",
      }
    }
  },
  ja: {
    common: {
      search: "タスクを検索...",
      delete: "削除",
    },
    skins: {
      title: "スキンを選択",
      active: "選択中",
    },
    history: {
      undo: "元に戻す",
      redo: "やり直す",
    },
    tabs: {
      act: "実行",
      pages: "ページ",
      info: "情報",
      inspect: "詳細",
    },
    nextActions: {
      title: "次のアクション",
      subtitle: "これらに着手して進捗を生みましょう。",
      empty: "完了です！ 🎉",
      emptySub: "ツリーにタスクを追加してください。",
    },
    canvas: {
      addTask: "+ タスク追加",
      addToConnect: "追加して接続",
      addToPlaceFree: "自由に配置",
      deleteSelected: "選択項目を削除",
    },
    info: {
      title: "使い方",
      description: "クイックガイドとショートカットキー。",
      shortcuts: "ショートカット",
      interactions: "操作方法",
      shortcutItems: {
        addChild: "子タスク追加",
        addSibling: "兄弟タスク追加",
        delete: "削除",
        editText: "テキスト編集",
      },
      interactionItems: {
        reparent: "親の変更: ドラッグして他のノードに重ねる",
        edgeStyle: "線のスタイル: 線をクリックして変更",
        multiSelect: "複数選択: Shift + ドラッグ",
        skins: "スキン: 右上のパネルでテーマ切り替え",
      }
    }
  }
} as const;
