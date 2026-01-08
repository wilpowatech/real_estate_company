-- Enable RLS on new tables
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Chat conversations policies
CREATE POLICY "Users can view conversations they're part of" ON chat_conversations
  FOR SELECT USING (
    auth.uid() = agent_id OR auth.uid() = client_id
  );

CREATE POLICY "Agents can create conversations" ON chat_conversations
  FOR INSERT WITH CHECK (
    auth.uid() = agent_id AND 
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'agent'
  );

-- Chat messages policies
CREATE POLICY "Users can view messages in their conversations" ON chat_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT agent_id FROM chat_conversations WHERE id = conversation_id
      UNION
      SELECT client_id FROM chat_conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT agent_id FROM chat_conversations WHERE id = conversation_id
      UNION
      SELECT client_id FROM chat_conversations WHERE id = conversation_id
    )
  );

-- Agent verification policies
CREATE POLICY "Users can view their own verification" ON agent_verifications
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Admins can view all verifications" ON agent_verifications
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Agents can submit verification" ON agent_verifications
  FOR INSERT WITH CHECK (
    auth.uid() = agent_id AND
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'agent'
  );

CREATE POLICY "Admins can update verifications" ON agent_verifications
  FOR UPDATE USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policies table (everyone can read, only admins can write)
CREATE POLICY "Everyone can read policies" ON policies
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage policies" ON policies
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );
