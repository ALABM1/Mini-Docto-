import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final data = await _apiService.login(email, password);
      _user = User.fromJson(data['user']);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _apiService.register(name, email, password);
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> tryAutoLogin() async {
    final userData = await _apiService.getStoredUser();
    if (userData != null) {
      _user = User.fromJson(userData);
      notifyListeners();
      return true;
    }
    return false;
  }

  void logout() {
    _apiService.logout();
    _user = null;
    notifyListeners();
  }
}
