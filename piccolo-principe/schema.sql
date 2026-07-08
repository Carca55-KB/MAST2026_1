CREATE TABLE citazioni (
    id SERIAL PRIMARY KEY,
    testo TEXT NOT NULL,
    autore VARCHAR(100) NOT NULL,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO citazioni (testo, autore) VALUES 
('Si vede solo con il cuore. L''essenziale è invisibile agli occhi.', 'La Volpe'),
('Tu diventi responsabile per sempre di quello che hai addomesticato.', 'La Volpe'),
('Tutte le grandi persone sono state bambini, ma poche se ne ricordano.', 'Antoine de Saint-Exupéry');
