const frameworks = [
  { name: 'Next.js', icon: '⚡' },
  { name: 'React', icon: '⚛️' },
  { name: 'Vue', icon: '💚' },
  { name: 'Angular', icon: '🅰️' },
  { name: 'Laravel', icon: '🔺' },
  { name: 'Django', icon: '🐍' },
  { name: 'WordPress', icon: '📝' },
  { name: 'Shopify', icon: '🛍️' },
];

export function FrameworkCompatibility() {
  return (
    <section className='border-border/40 border-t py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Works with your favorite tools</h2>
          <p className='text-muted-foreground'>
            Integrate seamlessly with any framework, CMS, or platform in minutes
          </p>
        </div>
        <div className='grid grid-cols-4 items-center justify-items-center gap-8 md:grid-cols-8'>
          {frameworks.map((framework) => (
            <div
              key={framework.name}
              className='hover:bg-card flex flex-col items-center space-y-2 rounded-lg p-4 transition-colors'
            >
              <div className='text-3xl'>{framework.icon}</div>
              <span className='text-sm font-medium'>{framework.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
