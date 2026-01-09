'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

const supabase = createClient();

export default function InquiriesPage() {
  const [task, setTask] = useState('');
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('todos') // your table name
      .select('*')
      .order('inserted_at', { ascending: false });

    if (error) console.error(error);
    else setInquiries(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('todos').insert([{ task }]);
    if (error) console.error(error);
    else {
      setTask('');
      fetchInquiries();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Inquiries</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter inquiry"
          required
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add Inquiry</button>
      </form>

      <ul>
        {inquiries.map((inq) => (
          <li key={inq.id}>{inq.task}</li>
        ))}
      </ul>
    </div>
  );
}
