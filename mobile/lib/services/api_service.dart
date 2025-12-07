import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // Use 'http://localhost:5000/api' for Web/Windows
  // Use 'http://10.0.2.2:5000/api' for Android Emulator
  static const String baseUrl = 'http://localhost:5000/api'; 
  final _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _storage.write(key: 'token', value: data['token']);
      await _storage.write(key: 'user', value: jsonEncode(data['user']));
      return data;
    } else {
      throw Exception(jsonDecode(response.body)['message']);
    }
  }

  Future<void> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'role': 'user'
      }),
    );

    if (response.statusCode != 201) {
      throw Exception(jsonDecode(response.body)['message']);
    }
  }

  Future<Map<String, dynamic>?> getStoredUser() async {
    final userStr = await _storage.read(key: 'user');
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'user');
  }

  Future<List<dynamic>> getProfessionals() async {
    final response = await http.get(Uri.parse('$baseUrl/professionals'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load professionals');
    }
  }

  Future<void> bookAppointment(String patientId, String professionalId, DateTime date) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patientId': patientId,
        'professionalId': professionalId,
        'date': date.toIso8601String(),
      }),
    );

    if (response.statusCode != 201) {
      throw Exception(jsonDecode(response.body)['message']);
    }
  }

  Future<List<dynamic>> getMyAppointments(String userId) async {
    final token = await _storage.read(key: 'token');
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/$userId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load appointments');
    }
  }
  
  Future<void> cancelAppointment(String appointmentId) async {
    final token = await _storage.read(key: 'token');
    final response = await http.delete(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to cancel appointment');
    }
  }
}
