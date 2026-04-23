import MaskSettings from '@/components/MaskSettings';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">マスク設定</h1>
      <p className="text-sm text-slate-400 mb-6">
        設定した単語はサーバー側で置き換えて表示されます。誰が見ても置き換え後の名前になります。
      </p>
      <MaskSettings />
    </div>
  );
}
