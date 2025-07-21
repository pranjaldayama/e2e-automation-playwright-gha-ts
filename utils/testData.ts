export const testData =   {
  email: `test${Date.now()}@example.com`, // Use a unique email for each run
  firstName: 'Playwright',
  lastName: 'User',
  street: '123 Test Street',
  city: 'Amsterdam',
  state: 'North Holland', // This should match the exact text in the dropdown for Netherlands
  postcode: '1000AA',
  country: 'Netherlands',
  phone: '0612345678',
  shippingCountry: 'Netherlands',
  discountCode: '20poff',
  baseUrl: 'https://magento.softwaretestingboard.com/customer/account/login',
  men: {
    category: ['Men', 'Tops', 'Jackets'],
    name: 'Size',
    size: 'XS',
    color: 'Black',
    quantity: 1,
  },
  women: {
    category: ['Women', 'Tops', 'Jackets'],
    name: 'Size',
    size: 'XS',
    color: 'Black',
    quantity: 1,
  },
  gear: {
    name: 'Activity',
    category: ['Gear', 'Bags'],
    activity: 'Yoga',
    quantity: 1
  },
}; 