# Mini Docto+ 🏥

Application complète de prise de rendez-vous médicaux (Test Technique ReadyToTek).

## 🚀 Guide de Démarrage Rapide

Suivez ces étapes pour lancer le projet complet en quelques minutes.

### 📋 Prérequis
*   **Node.js** (v14 ou supérieur)
*   **Flutter SDK** (v3.0 ou supérieur)
*   **MongoDB** (Doit être lancé localement sur le port 27017)

---

### 1️⃣ Lancer le Backend (API)
Le backend gère la base de données et l'API.

```bash
cd backend
npm install
# Créer un fichier .env avec:
# MONGO_URI=mongodb://localhost:27017/mini_docto
# JWT_SECRET=votre_secret
npm start
```
> Le serveur démarrera sur `http://localhost:5000` et se connectera à MongoDB (`mini_docto`).

---

### 2️⃣ Lancer le Web (Espace Professionnel)
Interface pour les médecins afin de gérer leurs disponibilités.

```bash
cd web
npm install
npm start
```
> L'application s'ouvrira sur `http://localhost:3000`.

**Comptes de Test (Médecins) :**
*   **Email**: `house@test.com` / **Pass**: `password`
*   **Email**: `strange@test.com` / **Pass**: `password`
*   **Email**: `who@test.com` / **Pass**: `password`
*   **Email**: `grey@test.com` / **Pass**: `password`

---

### 3️⃣ Lancer le Mobile (Espace Patient)
Interface pour les patients (développée en Flutter).
*Pour faciliter le test sans émulateur Android, nous recommandons de lancer la version Web de l'app mobile.*

```bash
cd mobile
flutter pub get
flutter run -d chrome
```
> Une fenêtre Chrome s'ouvrira avec l'application mobile.
> **Note**: Si l'écran reste blanc, appuyez sur `R` (Shift+r) dans le terminal pour rafraîchir.

**Compte de Test (Patient) :**
*   Vous pouvez créer un nouveau compte ou utiliser un existant.
*   **Email**: `ala@gmail.com` / **Pass**: `password`
*   **Email**: `patient@test.com` / **Pass**: `password`

---

## ✨ Fonctionnalités Clés à Tester

1.  **Synchronisation Temps Réel** 🔄
    *   Ouvrez le **Web** (Médecin) et le **Mobile** (Patient) côte à côte.
    *   Ajoutez ou supprimez un créneau sur le Web.
    *   Regardez le Mobile : le créneau apparaîtra/disparaîtra automatiquement en quelques secondes (sans recharger la page !).

2.  **Gestion des Fuseaux Horaires** 🌍
    *   L'application gère correctement la conversion entre l'heure UTC (Serveur) et l'heure locale de l'utilisateur.

3.  **Analytics** 📊
    *   Le projet intègre **Firebase Analytics** pour suivre les vues d'écran et les connexions sur Web et Mobile.

4.  **Inscription & Authentification** 🔐
    *   Les **Professionnels** peuvent s'inscrire directement depuis l'interface Web.
    *   Les **Patients** peuvent créer leur compte depuis l'application Mobile.

---

## 🛠 Architecture Technique

*   **Backend**: Node.js (Express) + MongoDB
*   **Mobile (Patient)**: Flutter
*   **Web (Professionnel)**: React

### Sécurité & Performance
*   **JWT**: Authentification sécurisée par token.
*   **Bcrypt**: Mots de passe hachés.
*   **Secure Storage**: Stockage sécurisé des tokens sur mobile.
*   **Optimisation**: Le tri des médecins par score est fait côté serveur (MongoDB) pour la performance.

## Auteur
Aleddine Ben Mahmoud
