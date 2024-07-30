import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadValidation } from '@/lib/validations/thread';
import { Button, Textarea } from '@/components/ui';

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      text: '',
      author: userId,
    },
  });

  const onSubmit = async (data: any) => {
    await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/threads'); // Redirect after posting
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Textarea {...form.register('text')} rows={15} placeholder="Content of the thread" />
      <Button type="submit">Post Thread</Button>
    </form>
  );
}

export default PostThread;
