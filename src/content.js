// Copy is placeholder written from the product names only. Replace it with the real
// descriptions before launch. To add a product, add an entry here and give it an Art
// component (see components/TryOnMeShow.jsx for a simple one).
import { CollabShow } from './components/CollabShow'
import { PathoGenShow } from './components/PathoGenShow'
import { TryOnMeShow } from './components/TryOnMeShow'

export const CONTACT_EMAIL = 'hello@seshatinfotech.com'

export const PRODUCTS = [
  {
    id: 'tryonme',
    name: 'TryOnMe',
    tagline: 'See the fit before you buy.',
    body: 'A phone camera becomes a fitting room. Shoppers see how a garment sits on their own body, and brands take the guesswork out of sizing.',
    Art: TryOnMeShow,
  },
  {
    id: 'collab',
    name: 'Collab',
    tagline: 'One shared page for the whole team.',
    body: 'People, files and decisions in one place, so a project stops scattering across chat threads and inboxes.',
    Art: CollabShow,
  },
  {
    id: 'pathogen',
    name: 'PathoGen',
    tagline: 'Pathology data, laid out for review.',
    body: 'Pathology and genomic results organised so specialists can check every call and trace it back to the evidence.',
    Art: PathoGenShow,
  },
]
