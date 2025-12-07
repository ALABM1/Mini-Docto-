import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/professional.dart';

class DataProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<Professional> _professionals = [];
  List<dynamic> _appointments = [];
  bool _isLoading = false;

  List<Professional> get professionals => _professionals;
  List<dynamic> get appointments => _appointments;
  bool get isLoading => _isLoading;

  Future<void> fetchProfessionals({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      notifyListeners();
    }

    try {
      final data = await _apiService.getProfessionals();
      _professionals = data.map((json) => Professional.fromJson(json)).toList();
    } catch (e) {
      print(e);
    } finally {
      if (!silent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  Future<void> fetchMyAppointments(String userId, {bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      notifyListeners();
    }

    try {
      _appointments = await _apiService.getMyAppointments(userId);
    } catch (e) {
      print(e);
    } finally {
      if (!silent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  Future<void> bookAppointment(String patientId, String professionalId, DateTime date) async {
    await _apiService.bookAppointment(patientId, professionalId, date);
    await fetchMyAppointments(patientId); // Refresh appointments
    await fetchProfessionals(); // Refresh availability
  }
  
  Future<void> cancelAppointment(String appointmentId, String userId) async {
    await _apiService.cancelAppointment(appointmentId);
    await fetchMyAppointments(userId);
    await fetchProfessionals();
  }
}
