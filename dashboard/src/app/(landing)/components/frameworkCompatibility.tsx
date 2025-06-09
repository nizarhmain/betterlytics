import Image from 'next/image';

const frameworks = [
  { name: 'Next.js', logo: '/framework-logos/nextjs.svg' },
  { name: 'React', logo: '/framework-logos/react.svg' },
  { name: 'Vue.js', logo: '/framework-logos/vue.svg' },
  { name: 'Angular', logo: '/framework-logos/angular.svg' },
  { name: 'Svelte', icon: '💚' },
  { name: 'Nuxt.js', icon: '💚' },
  { name: 'Gatsby', icon: '💚' },
  { name: 'Astro', icon: '💚' },
  { name: 'Laravel', icon: '💚' },
  { name: 'Django', icon: '💚' },
  { name: 'Ruby on Rails', icon: '💚' },
  { name: 'Spring Boot', icon: '💚' },
  { name: 'Express.js', icon: '💚' },
  { name: 'Flask', icon: '💚' },
  { name: 'WordPress', icon: '💚' },
  { name: 'Drupal', icon: '💚' },
  { name: 'Joomla', icon: '💚' },
  { name: 'Shopify', icon: '💚' },
  { name: 'WooCommerce', icon: '💚' },
  { name: 'Magento', icon: '💚' },
  { name: 'PrestaShop', icon: '💚' },
  { name: 'Webflow', icon: '💚' },
  { name: 'Squarespace', icon: '💚' },
  { name: 'Wix', icon: '💚' },
  { name: 'Ghost', icon: '💚' },
  { name: 'Hugo', icon: '💚' },
  { name: 'Jekyll', icon: '💚' },
  { name: 'Eleventy', icon: '💚' },
  { name: 'Remix', icon: '💚' },
  { name: 'SvelteKit', icon: '💚' },
  { name: 'Qwik', icon: '💚' },
  { name: 'Solid.js', icon: '💚' },
  { name: 'Alpine.js', icon: '💚' },
  { name: 'Ember.js', icon: '💚' },
  { name: 'Backbone.js', icon: '💚' },
];

export function FrameworkCompatibility() {
  return (
    <section className='border-border/40 overflow-hidden border-t py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Works with your favorite tools</h2>
          <p className='text-muted-foreground'>
            Universal compatibility - works with any website, framework, or platform
          </p>
        </div>

        <div className='relative overflow-hidden'>
          <div className='flex animate-[scroll_50s_linear_infinite] space-x-8 hover:[animation-play-state:paused]'>
            {frameworks.map((framework, index) => (
              <div
                key={`first-${index}`}
                className='hover:bg-card flex min-w-[120px] flex-shrink-0 flex-col items-center space-y-2 rounded-lg p-4 transition-colors'
              >
                <div className='flex h-8 w-8 items-center justify-center'>
                  {framework.logo ? (
                    <Image
                      src={framework.logo}
                      alt={`${framework.name} logo`}
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                  ) : (
                    <div className='text-3xl'>{framework.icon}</div>
                  )}
                </div>
                <span className='text-center text-sm font-medium'>{framework.name}</span>
              </div>
            ))}
          </div>

          {/* Left fade gradient */}
          <div className='from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r to-transparent'></div>

          {/* Right fade gradient */}
          <div className='from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l to-transparent'></div>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-muted-foreground text-sm'>
            And countless more... If it runs on the web, we support it!
          </p>
        </div>
      </div>
    </section>
  );
}
