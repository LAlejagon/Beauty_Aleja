/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'via.placeholder.com', // ✅ Agregado
      'blushbar.vtexassets.com'
    ]
  }
}

module.exports = nextConfig;
