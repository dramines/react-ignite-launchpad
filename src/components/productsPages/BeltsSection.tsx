import React from "react";
import { useLocation } from "react-router-dom";

const BeltsSection = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'category');

  const [type, category, itemgroup] = pathSegments;

  const getImageUrl = () => {
    if (type === 'pret-a-porter') {
      if (category === 'homme') {
        switch (itemgroup) {
          case 'costumes':
            return "/Pcis/costumes.png";
          case 'blazers':
            return "/Pcis/blazers.png";
          case 'chemises':
            return "/Pcis/chemisehomme.png";
          case 'pantalons':
            return "/Pcis/PantallonHomme.png";
          case 'pollo':
            return "/Pcis/pull.png";
          default:
            return "/Articles/Main.png";
        }
      } else if (category === 'femme') {
        switch (itemgroup) {
          case 'chemises':
            return "/Pcis/chemisefemme.png";
          case 'robes':
            return "/Pcis/robe.png";
          case 'vestes':
            return "/Pcis/VestesFemme.png";
          default:
            return "/Articles/Main.png";
        }
      }
    }
    return "/Articles/Main.png";
  };

  const getContent = () => {
    // Special handling for outlet items
    if (type === 'outlet') {
      return {
        title: "Outlet",
        subtitle: "SOLDES ET PROMOTIONS",
        description: (
          <div className="space-y-4">
            <p className="text-[#700100] font-semibold">
              Profitez de la catégorie Outlet dont vous bénéficiez des Offres exceptionnelles
            </p>
            <p className="text-[#700100] font-bold text-lg">
              Jusqu'à 70% de réduction
            </p>
          </div>
        ),
        imageUrl: getImageUrl()
      };
    }
    
    if (itemgroup === 'portefeuilles') {
      return {
        title: "Portefeuilles",
        subtitle: "ÉLÉGANCE ET FONCTIONNALITÉ",
        description: (
          <p>
            Le portefeuille en cuir est une pièce emblématique et essentielle dans une collection d'accessoires dont chaque homme a besoin dans son quotidien. Il allie fonctionnalité, durabilité et esthétique raffinée.
            <br /><br />
            Accompagnée avec son coffret cadeau, cette pièce peut être offerte en ajoutant l'option de personnalisation des initiales en dorure à chaud ou nom et prénom ou un petit mot en gravure laser.
          </p>
        ),
        imageUrl: getImageUrl()
      };
    } else if (itemgroup === 'ceintures') {
      return {
        title: "Ceintures",
        subtitle: "RAFFINEMENT ET ÉLÉGANCE",
        description: (
          <p>
            La ceinture en cuir est un accessoire essentiel dans une collection de prêt-à-porter pour homme de luxe.
            Cette ceinture est destinée à l'homme élégant, soucieux de détails et de qualité. Que ce soit pour compléter un costume ou pour rehausser une tenue décontractée, elle s'adapte à toutes les situations avec sophistication.
            <br /><br />
            Cette pièce est accompagnée d'une housse personnalisée avec le nom de la marque et un coffret qui met en valeur la ceinture qui peut être offerte en lui rajoutant une personnalisation des initiales à l'extérieur ou une gravure à l'intérieur.
          </p>
        ),
        imageUrl: getImageUrl()
      };
    }

    // Default content based on current category
    const titles: { [key: string]: string } = {
      'chemises': 'Chemises',
      'robes': 'Robes',
      'vestes': 'Vestes/Manteaux',
      'costumes': 'Costumes',
      'blazers': 'Blazers',
      'pantalons': 'Pantalons',
      'pollo': 'Polo'
    };

    return {
      title: titles[itemgroup] || "Collection",
      subtitle: "ÉLÉGANCE ET RAFFINEMENT",
      description: "Découvrez nos créations exclusives, façonnées avec passion et savoir-faire en Tunisie.",
      imageUrl: getImageUrl()
    };
  };

  const content = getContent();

  return (
    <section className="flex flex-col md:flex-row items-start justify-center px-4 md:px-6 py-6 bg-[#EFEDED]">
      <div className="w-full md:w-2/3 text-left md:pr-8">
        <h1 className="text-[24px] md:text-[36px] font-light text-[#4C3A36] mb-2">
          {content.title}
        </h1>
        <h3 className="text-[12px] md:text-[16px] font-normal text-[#4C3A36] tracking-widest uppercase mb-4">
          {content.subtitle}
        </h3>
        <div className="text-[14px] md:text-[16px] text-[#4C3A36] leading-relaxed">
          {content.description}
        </div>
      </div>
      <div className="w-full md:w-1/3 mt-6 md:mt-0">
        <div className="relative w-full h-[250px]">
          <img
            src={content.imageUrl}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-contain rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default BeltsSection;