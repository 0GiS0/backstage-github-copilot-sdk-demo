-- Seed data for memes
INSERT INTO memes (id, title, description, image_url, category, tags, likes, views)
VALUES
  (1, 'Always creative', 'Developer creating simple and intuitive UI while pretending to be a genius despite copying from Stack Overflow.', 'https://i.chzbgr.com/full/10562962176/h3DF892FA/dev-creates-simple-and-intuitive-ui-user', 'Devs', ARRAY['creativity', 'design', 'UI', 'development'], 20000, 0),
  (2, 'Look at Code I Wrote Last Year', 'Moment of regret when revisiting old code and realizing how terrible and inefficient it actually was.', 'https://i.chzbgr.com/full/10562963968/hF0770D4B/look-at-code-wrote-last-year-why-why-n-imgflipcom-why-oh-s-why', 'Devs', ARRAY['learning', 'growth', 'UI', 'development'], 15000, 0),
  (3, 'Always improving', 'Hiring another designer while the engineers handle everything because one person cannot be enough.', 'https://i.chzbgr.com/full/10562966272/h8346A8D3/hires-another-designer-engineers-company-hires-another-engineer-am-not-enough-apes-together-strong', 'Devs', ARRAY['improvement', 'design', 'UI', 'development'], 18000, 0),
  (4, 'Always adapting', 'CSS styling chaos depicted as a cat struggling with width 100% and height 100% responsive design.', 'https://i.chzbgr.com/full/10562966528/hF0E40B8F/cat-width-100-height-100-1234', 'Devs', ARRAY['adaptation', 'design', 'UI', 'development'], 17000, 0),
  (5, 'Always collaborating', 'Team collaboration on bad days at work when everything breaks and nobody knows how to fix it.', 'https://www.globalnerdy.com/wp-content/uploads/2025/08/bad-day-at-work.jpg', 'Devs', ARRAY['collaboration', 'design', 'UI', 'development'], 16000, 0),
  (6, 'Debugging life', 'Spending 6 hours debugging code only to realize the issue was a simple typo or forgotten semicolon.', 'https://www.globalnerdy.com/wp-content/uploads/2025/08/6-hours-of-debugging.jpeg', 'Devs', ARRAY['debugging', 'life', 'UI', 'development'], 19000, 0),
  (7, 'I see something else', 'Its a diswasher tablet but I see something else.', 'https://www.globalnerdy.com/wp-content/uploads/2025/08/dishwasher-tablet-or-python-icon.jpeg', 'Devs', ARRAY['version control', 'chaos', 'UI', 'development'], 14000, 0),
  (8, 'We are here to replace you', 'Robot saying that we are here to replace you.', 'https://www.globalnerdy.com/wp-content/uploads/2025/08/here-to-replace-you.jpg', 'Devs', ARRAY['version control', 'chaos', 'UI', 'development'], 14000, 0)

ON CONFLICT (id) DO NOTHING;

-- Align sequence
SELECT setval(pg_get_serial_sequence('memes','id'), (SELECT MAX(id) FROM memes));
