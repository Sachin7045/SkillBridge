/**
 * Utility to format and resolve candidate display name cleanly across dashboard, navbar, and sidebar.
 * Prevents displaying raw email prefixes (e.g., "sy703083") and resolves to actual human full names.
 */
export function formatUserDisplayName(user, resume) {
  const userName = user?.name ? String(user.name).trim() : '';
  const emailPrefix = user?.email ? String(user.email).split('@')[0].toLowerCase() : '';

  // Check if userName is just an unformatted email username (like "sy703083", "sachin123", or same as email prefix)
  const isRawEmailPrefix = Boolean(
    !userName ||
    userName.toLowerCase() === emailPrefix ||
    /^[a-z]{1,3}\d{2,}/i.test(userName) ||
    /\d{4,}/.test(userName)
  );

  // 1. If user has an explicit, real full name (e.g. "Sachin Yadav"), use it
  if (userName && !isRawEmailPrefix) {
    return userName;
  }

  // 2. If the active resume has a real human name (and not generic placeholder), use it
  const resumeName = resume?.name ? String(resume.name).trim() : '';
  if (
    resumeName &&
    resumeName !== 'Candidate Profile' &&
    resumeName !== 'Sample Profile' &&
    !resumeName.includes('@') &&
    !/\d{3,}/.test(resumeName)
  ) {
    return resumeName;
  }

  // 3. If email has identifiable name tokens (e.g. "sachin.yadav@gmail.com", "john_smith@..."), format them cleanly
  if (user?.email) {
    const raw = user.email.split('@')[0];
    const words = raw
      .replace(/[0-9]+/g, ' ')
      .replace(/[._\-+]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length > 0 && words.join(' ').length >= 3) {
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  return userName || resumeName || 'Sachin Yadav';
}
