# Révision éditoriale du rapport SEO

**Date :** 18 juillet 2026

## Objectif

Mettre à jour le rapport SEO existant pour qu'il reflète le rôle actuel de Yann, ses compétences en IA, développement, DevOps, Python et data, ainsi que son statut de salarié chez Ipanova.

Le texte doit être direct, précis et crédible. Il ne doit pas reprendre les automatismes de rédaction associés aux contenus générés par IA.

## Règles éditoriales

- Ne pas utiliser de tiret cadratin.
- Éviter les points-virgules.
- Supprimer les phrases génériques qui ne donnent ni fait, ni preuve, ni décision.
- Préférer des phrases courtes.
- Employer un anglicisme lorsqu'il est plus naturel que sa traduction littérale.
- Utiliser `human in the loop` uniquement dans un contexte technique précis.
- Pour le positionnement général, écrire que Yann garde l'humain au centre et utilise l'IA pour augmenter l'expertise.
- Ne pas présenter Yann comme freelance.
- Ne pas reprendre les notes de compétences sur cinq issues du CRM.

## Anonymisation du contexte aéronautique

Airbus ne doit pas être nommé.

Formulation de référence :

> Programme international de transformation SAP S/4HANA dans l'aéronautique, visant à remplacer six ERP historiques par un système commun pour l'assemblage, la planification, la supply chain et la logistique.

Le rapport peut préciser que Yann intervient depuis Toulouse sur le périmètre industriel américain, notamment lié au site de Mobile. Il peut mentionner le contexte de montée en cadence et le poids majeur de la logistique dans la transformation.

L'acronyme ARP ne sera pas utilisé. Il obligerait à citer sa signification et réduirait l'anonymisation.

## Éléments issus du document Boondmanager

Le rapport peut s'appuyer sur les faits suivants :

- conception et déploiement d'une plateforme interne d'adoption de l'IA
- création d'assistants spécialisés pour les métiers de la data, de l'ingénierie, du support et des fonctions métier
- animation d'ateliers et de formations
- accompagnement des utilisateurs sur des cas réels
- travail dans un environnement POD GenAI sur une landing zone GCP
- création d'outils de data visualisation, de tableaux de bord et de micro-applications
- automatisations avec n8n
- usage avancé de Claude Code et Gemini
- contribution aux réponses à appels d'offres et à la prévente
- expérience de lead technique, support, CI/CD Docker et conception de solutions

Ces faits devront être reformulés en français naturel. Le rapport ne doit pas recopier le style commercial du CRM.

## Python et data

Le projet public `job-market-intelligence` servira de preuve.

Le rapport mentionnera :

- Python 3.11+
- Streamlit
- pandas
- Plotly
- Pydantic
- intégration des API France Travail et Adzuna
- normalisation de sources hétérogènes
- déduplication multi-source
- cache des données
- tolérance à la panne d'une source
- analyse des compétences demandées, des salaires et des recruteurs
- tests sur les fonctions de traitement et d'agrégation

Le positionnement attendu est « capacité opérationnelle en Python et data », pas « data scientist » ni « data engineer senior ».

## Mesure et analytics

Vercel Analytics est le choix retenu pour la mesure d'audience et les Web Vitals, dans le cadre du plan Vercel Pro.

Le rapport ne proposera pas Google Analytics comme solution par défaut. Google Search Console reste nécessaire pour suivre l'indexation, les requêtes, les impressions, les clics et le CTR organique.

La mesure des conversions doit rester sobre. Les événements utiles sont les clics vers le CV, les études de cas, LinkedIn, l'email et les prises de contact qualifiées.

## Périmètre de la révision

Le rapport existant sera conservé, puis réécrit en profondeur sur les points suivants :

1. synthèse exécutive
2. proposition de valeur
3. wording de la home
4. description du contexte aéronautique
5. inventaire des compétences et preuves
6. projets à mettre en avant
7. stratégie éditoriale
8. données structurées
9. analytics et indicateurs
10. roadmap

Les constats techniques vérifiés restent inchangés, sauf lorsqu'une formulation doit être simplifiée.

## Critères de validation

- aucune occurrence de tiret cadratin
- aucun usage de « humain dans la boucle »
- aucun usage de « Airbus » ou « ARP » hors section expliquant les choix d'anonymisation de cette spécification
- la formulation validée sur la transformation SAP S/4HANA est présente
- Python et data sont appuyés par le projet GitHub
- Vercel Analytics est présenté comme le choix retenu
- les phrases génériques sans preuve sont supprimées
- le statut salarié chez Ipanova reste explicite
