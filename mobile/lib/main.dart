import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'providers/auth_provider.dart';
import 'providers/data_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
   await Firebase.initializeApp(
     options: const FirebaseOptions(
        apiKey: "AIzaSyD5DubIKAbQ75N7WjlToboTSo3OpHjWZhE",
        authDomain: "mini-docto-56ac7.firebaseapp.com",
        projectId: "mini-docto-56ac7",
        storageBucket: "mini-docto-56ac7.appspot.com",
        messagingSenderId: "706897055634",
        appId: "1:706897055634:web:982ddacc432ba0b7a83b4b",
        measurementId: "G-0FXXT28ZLP"
     ),
   ); // Uncomment this AFTER adding google-services.json
  
  runApp(const MyApp());
}class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DataProvider()),
      ],
      child: MaterialApp(
        title: 'Mini Docto',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          useMaterial3: true,
        ),
        navigatorObservers: [
          FirebaseAnalyticsObserver(analytics: FirebaseAnalytics.instance),
        ],
        home: const LoginScreen(),
        routes: {
          '/home': (context) => const HomeScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
        },
      ),
    );
  }
}
