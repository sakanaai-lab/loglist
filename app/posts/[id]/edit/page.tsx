import EditPostForm from '@/components/EditPostForm';
import Link from 'next/link';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <Link href={`/posts/${id}`} className="text-sm text-gray-400 hover:text-gray-600">
          ← 投稿に戻る
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-6">ログを編集</h1>
      <EditPostForm postId={Number(id)} />
    </div>
  );
}
