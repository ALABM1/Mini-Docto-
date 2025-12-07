class Professional {
  final String id;
  final String name;
  final int score;
  final List<DateTime> availability;

  Professional({required this.id, required this.name, required this.score, required this.availability});

  factory Professional.fromJson(Map<String, dynamic> json) {
    return Professional(
      id: json['_id'],
      name: json['name'],
      score: json['score'] ?? 0,
      availability: (json['availability'] as List<dynamic>?)
              ?.map((e) => DateTime.parse(e))
              .toList() ??
          [],
    );
  }
}
