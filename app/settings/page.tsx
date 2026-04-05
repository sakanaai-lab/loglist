import MaskSettings from '@/components/MaskSettings';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">マスク設定</h1>
      <p className="text-sm text-gray-400 mb-6">
        設定した単語はあなたのブラウザ上でのみ置き換えて表示されます。投稿データは変わりません。
      </p>
      <MaskSettings />
    </div>
  );
}
