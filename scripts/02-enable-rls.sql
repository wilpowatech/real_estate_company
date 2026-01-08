-- RLS Policies for users table
CREATE POLICY "Users can view public user info" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for agents table
CREATE POLICY "Anyone can view verified agents" ON agents
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = id);

CREATE POLICY "Agents can update their own profile" ON agents
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for properties table
CREATE POLICY "Anyone can view published properties" ON properties
  FOR SELECT USING (is_published = true);

CREATE POLICY "Agents can see their own unpublished properties" ON properties
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = agent_id);

-- RLS Policies for property_media
CREATE POLICY "Anyone can view property media" ON property_media
  FOR SELECT USING (true);

CREATE POLICY "Agents can manage media for their properties" ON property_media
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT agent_id FROM properties WHERE id = property_id)
  );

CREATE POLICY "Agents can delete media for their properties" ON property_media
  FOR DELETE USING (
    auth.uid() IN (SELECT agent_id FROM properties WHERE id = property_id)
  );

-- RLS Policies for inquiries
CREATE POLICY "Agents can view inquiries for their properties" ON inquiries
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Users can view their own inquiries" ON inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can update inquiries for their properties" ON inquiries
  FOR UPDATE USING (auth.uid() = agent_id);

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" ON property_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites" ON property_favorites
  FOR SELECT USING (auth.uid() = user_id);
