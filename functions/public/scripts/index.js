const acontecimentos = [
	{
		dia: '-',
		descritivo: "Fernanda Peron se juntou ao time Sigma",
		mes: 'JAN',
	},
	{
		dia: '-',
		descritivo: "Adriano Lobo se juntou ao time Sigma",
		mes: 'JAN',
	},
	{
		dia: '-',
		descritivo: "Iria se juntou ao time Homologação",
		mes: 'JAN',
	},
	{
		dia: '30',
		descritivo: "Liberação dos ambientes HTTPS (EAM / Facelift)",
		mes: 'JAN',
	},
	{
		dia: '03',
		descritivo: "Rodrigo Teruel entra de férias",
		mes: 'FEV',
	},
	{
		dia: '03',
		descritivo: "Douglas Scola entra de férias",
		mes: 'FEV',
	},
	{
		dia: '05',
		descritivo: "Anderson descolou um headset daora pro Pedro",
		mes: 'FEV',
	},
	{
		dia: '05',
		descritivo: "Felicitometro começa a ser aplicado aos membros do Facelift",
		mes: 'FEV',
	},
	{
		dia: '05',
		descritivo: "Alan Lira - Certificação Microsoft 70-480 - Programação em HTML5 com JavaScript e CSS3",
		mes: 'FEV',
	},
	{
		dia: '13',
		descritivo: 'EAM - Entrega Função Transmissão',
		mes: 'FEV',
	},
	{
		dia: '17',
		descritivo: 'Mateus Rodrigues entra de férias',
		mes: 'FEV',
	},
	{
		dia: '17',
		descritivo: 'Fábio Ribeiro se juntou ao time Sigma',
		mes: 'FEV',
	},
	{
		dia: '18',
		descritivo: 'EAM - Inception na Treetech (Engine) - (Fabiano, Anderson, Uzai)',
		mes: 'FEV',
	},
	{
		dia: '19',
		descritivo: 'Sigma - Entrega do FQ',
		mes: 'FEV',
	},
	{
		dia: '21',
		descritivo: 'Douglas Scola voltou de férias',
		mes: 'FEV',
	},
	{
		dia: '24',
		descritivo: 'Rodrigo Teruel voltou de férias',
		mes: 'FEV',
	},
	{
		dia: '26',
		descritivo: 'Jose Netto entra de férias',
		mes: 'FEV',
	},
	{
		dia: '26',
		descritivo: 'Novo modelo de branchs rodando no EAM',
		mes: 'FEV',
	},
	{
		dia: '27',
		descritivo: 'Mateus Rodrigues voltou de férias',
		mes: 'FEV',
	},
	{
		dia: '28',
		descritivo: 'Versão do EAM estável na CELEO - v2.43.117',
		mes: 'FEV',
	},
	{
		dia: '28',
		descritivo: 'Motta queridinho da Soad - "mesmo se ele estiver sem muita demanda quero que ele continue com a gente"',
		mes: 'FEV',
	},
	{
		dia: '02',
		descritivo: 'Pedro Santos entra de férias',
		mes: 'MAR',
	},
];

(function popularTimeline () {
	var timeline = document.getElementById("timeline_2020");

	acontecimentos.forEach((obj) => {
		var elemento = 
			`<div class="timeline__box">
				<div class="timeline__date">
					<span class="timeline__day">${obj.dia}</span>
					<span class="timeline__month">${obj.mes}</span>
				</div>
				<div class="timeline__post">
					<div class="timeline__content">
						<p>${obj.descritivo}</p>
					</div>
				</div>
			</div>`;
		timeline.insertAdjacentHTML('beforeend', elemento);
	});
})();