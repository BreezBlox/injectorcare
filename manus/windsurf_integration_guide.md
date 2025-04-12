# Windsurf Integration Guide for InjectorCare Directory Pages

## File Structure Overview
```
/js/
  - data.js         # Business listings data
  - search.js       # Search functionality
  - detail.js       # Business detail page functionality
/pages/
  - fuel-injector-directory.html      # Main directory landing page
  - services-near-me.html             # Services search page
  - business-detail.html              # Business detail page template
  - forums.html                       # Forums & YouTube resources page
```

## Integration Steps by File

### 1. JavaScript Files

#### data.js
- Contains all business listings data
- Must be loaded before search.js and detail.js
- Can be customized with your own local business listings
- Modify city data to focus on your target service areas

#### search.js
- Powers the search functionality on services-near-me.html
- Handles location search and results display
- Contains event listeners for search form and business cards
- Requires data.js to be loaded first

#### detail.js
- Controls the dynamic content on business-detail.html
- Loads business details based on URL parameters
- Handles image gallery, similar businesses, and interactive elements
- Requires data.js to be loaded first

### 2. HTML Pages

#### fuel-injector-directory.html (Main Directory)
- Entry point for the directory section
- Links to both services-near-me.html and forums.html
- Minimal JavaScript dependencies (no special requirements)
- Update navigation links to match your site structure

#### services-near-me.html (Services Search)
- Core search functionality page
- Requires data.js and search.js
- Contains search form and results grid
- Update styling to match your site's color scheme and fonts

#### business-detail.html (Business Details)
- Template for individual business pages
- Requires data.js and detail.js
- Dynamically populated based on URL parameter (id)
- Update styling to match your site's design elements

#### forums.html (Resources Page)
- Static content page with external links
- No special JavaScript requirements
- Update with forums and YouTube channels relevant to your audience
- Match styling with your site's design system

## Integration Tips for Windsurf

1. **Start with JavaScript files**: Add these first to your project's js directory
2. **Test each page individually**: Add one HTML page at a time and test thoroughly
3. **Update navigation paths**: Ensure all relative links match your site structure
4. **Customize styling**: Update CSS to match your brand colors and typography
5. **Mobile testing**: Verify responsive behavior on various screen sizes
6. **SEO optimization**: Update meta tags and canonical URLs to match your domain
7. **Analytics**: Add your tracking code to monitor directory page performance

## Common Issues and Solutions

1. **Search not working**: Verify data.js is loaded before search.js
2. **Business details not loading**: Check URL parameters and console for errors
3. **Styling inconsistencies**: Use browser inspector to identify CSS conflicts
4. **Navigation issues**: Verify all relative paths match your site structure
5. **Mobile layout problems**: Test on multiple devices and adjust media queries

## SEO Considerations

1. Update all canonical URLs to use your domain (injectorcare.com)
2. Customize meta descriptions for each page with targeted keywords
3. Add structured data markup for local businesses
4. Ensure all images have descriptive alt text
5. Create a sitemap that includes all directory pages
