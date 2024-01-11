# Où est le BDE MIST dans la vie ?

[Site web : carte](https://mathis-girault.github.io)  
Ce site permet de voir, sur une carte, la position dans les prochains mois des personnes ayant entrées leur données.

## Informations 

### Utilisation

Vous disposez à l'écran d'une carte, et de marqueurs qui s'affichent sur la carte.
En haut à gauche un menu permet de choisir quels types de marqueurs vous voule voir, types correspondant à une temporalité.
Pour l'instant trois périodes sont possibles ;
 - 'Stage AI' : représentant la période du stage assistant ingénieur (été 2023)
 - 'Semestre 9' : réprésentant le premier semestre de 3e année d'école (fin 2023 / début 2024)
 - 'PFE' : représentant la période du PFE (mi 2024)

Un bouton sous le menu permet d'ajouter un marqueur, qui correspond à une personne, une position, et une temporalité.

Sur la carte, vous pouvez cliquer sur un marqueur pour voir quelles personnes correspondent au marqueur donné.
Un marqueur représente un lieu et une temporalité.
Un panneau de discussion est disponible pour chaque marqueur.

### Données

Les marqueurs ajoutés sont stockées dans une base de donnée qui recensie tous les marqueurs ayant étés ajoutés.  
Les marqueurs affichés sont extraits d'une base de donnée déployée.  
Les données ne sont en aucun cas utilisées à des fins commerciales, mais sont accessibles par tout le monde.
Pour retirer vos données il vous faut me contacter.  

### Ameiliorations

Ce site a été codé en quelques heures hésitez pas a proposer des modifications ou me dire ce qui ne va pas.
La version mobile n'est actuellement pas fonctionnelle.

### Licence

C'est sous licence GNU, si vous voulez vous pouvez tout a fait copier tout le projet pour faire le même avec tes potes, il faudra juste prendre votre propre base de donnée.

## Caractéristiques techniques

### Branches

Le site est deployé automatiquement à partir de la branch `main`, celle-ci contient donc uniquement le site buildé.
Le code compilé est push sur la branch `main` automatiquement dans les actions GitHub.
La branch principale de developpement est `dev`.

### Stack

Le site est codé en typescript, avec une petite partie html et css.
Il est compilé par tsc et utilise le bundler Webpack.
