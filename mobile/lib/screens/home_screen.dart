import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../providers/data_provider.dart';
import '../models/professional.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  Timer? _timer;

  static const List<Widget> _widgetOptions = <Widget>[
    ProfessionalsList(),
    MyAppointmentsList(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    // Fetch data on init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchData();
      // Auto-refresh every 5 seconds
      _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
        _fetchData(silent: true);
      });
    });
  }

  void _fetchData({bool silent = false}) {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      Provider.of<DataProvider>(context, listen: false).fetchProfessionals(silent: silent);
      Provider.of<DataProvider>(context, listen: false).fetchMyAppointments(user.id, silent: silent);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mini Docto'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.of(context).pushReplacementNamed('/login');
            },
          )
        ],
      ),
      body: user == null
          ? const Center(child: CircularProgressIndicator())
          : _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.medical_services),
            label: 'Professionals',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'My Appointments',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}

class ProfessionalsList extends StatelessWidget {
  const ProfessionalsList({super.key});

  @override
  Widget build(BuildContext context) {
    final dataProvider = Provider.of<DataProvider>(context);
    final professionals = dataProvider.professionals;

    if (dataProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView.builder(
      itemCount: professionals.length,
      itemBuilder: (context, index) {
        final pro = professionals[index];
        return Card(
          margin: const EdgeInsets.all(8.0),
          child: ExpansionTile(
            title: Text(pro.name),
            subtitle: Text('Score: ${pro.score}/100'),
            leading: CircleAvatar(child: Text(pro.score.toString())),
            children: [
              if (pro.availability.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No slots available'),
                )
              else
                ...pro.availability.map((date) {
                  return ListTile(
                    title: Text(DateFormat('yyyy-MM-dd HH:mm').format(date.toLocal())),
                    trailing: ElevatedButton(
                      onPressed: () async {
                        final user = Provider.of<AuthProvider>(context, listen: false).user;
                        if (user != null) {
                          try {
                            await Provider.of<DataProvider>(context, listen: false)
                                .bookAppointment(user.id, pro.id, date);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Booked successfully!')),
                            );
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Booking failed: $e')),
                            );
                          }
                        }
                      },
                      child: const Text('Book'),
                    ),
                  );
                }).toList(),
            ],
          ),
        );
      },
    );
  }
}

class MyAppointmentsList extends StatelessWidget {
  const MyAppointmentsList({super.key});

  @override
  Widget build(BuildContext context) {
    final dataProvider = Provider.of<DataProvider>(context);
    final appointments = dataProvider.appointments;

    if (dataProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (appointments.isEmpty) {
      return const Center(child: Text('No appointments yet.'));
    }

    return ListView.builder(
      itemCount: appointments.length,
      itemBuilder: (context, index) {
        final appt = appointments[index];
        final date = DateTime.parse(appt['date']);
        final proName = appt['professional']['name'];

        return Card(
          child: ListTile(
            title: Text('Dr. $proName'),
            subtitle: Text(DateFormat('yyyy-MM-dd HH:mm').format(date.toLocal())),
            trailing: IconButton(
              icon: const Icon(Icons.cancel, color: Colors.red),
              onPressed: () async {
                final user = Provider.of<AuthProvider>(context, listen: false).user;
                if (user != null) {
                   try {
                      await Provider.of<DataProvider>(context, listen: false)
                          .cancelAppointment(appt['_id'], user.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Cancelled successfully!')),
                      );
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Cancellation failed: $e')),
                      );
                    }
                }
              },
            ),
          ),
        );
      },
    );
  }
}
